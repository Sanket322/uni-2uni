import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting enquiry reminder check...');

    // Find enquiries that are:
    // 1. More than 24 hours old
    // 2. Status is still 'pending'
    // 3. No reminder has been sent yet
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: enquiries, error: enquiriesError } = await supabase
      .from('marketplace_enquiries')
      .select(`
        id,
        listing_id,
        buyer_name,
        created_at,
        listing:marketplace_listings(
          title,
          seller_id
        )
      `)
      .eq('status', 'pending')
      .eq('reminder_sent', false)
      .lt('created_at', twentyFourHoursAgo);

    if (enquiriesError) {
      console.error('Error fetching enquiries:', enquiriesError);
      throw enquiriesError;
    }

    console.log(`Found ${enquiries?.length || 0} enquiries needing reminders`);

    if (!enquiries || enquiries.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No enquiries need reminders', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let remindersCreated = 0;

    for (const enquiry of enquiries) {
      const listing = enquiry.listing as any;
      if (!listing?.seller_id) {
        console.warn(`No seller found for enquiry ${enquiry.id}`);
        continue;
      }

      // Create notification for seller
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: listing.seller_id,
          title: 'Marketplace Enquiry Reminder',
          message: `You have a pending enquiry from ${enquiry.buyer_name} for "${listing.title}". Please respond to help close the sale.`,
          type: 'marketplace',
          priority: 'medium',
          related_entity_type: 'marketplace_enquiry',
          related_entity_id: enquiry.id,
        });

      if (notificationError) {
        console.error(`Error creating notification for enquiry ${enquiry.id}:`, notificationError);
        continue;
      }

      // Mark reminder as sent
      const { error: updateError } = await supabase
        .from('marketplace_enquiries')
        .update({ reminder_sent: true })
        .eq('id', enquiry.id);

      if (updateError) {
        console.error(`Error updating enquiry ${enquiry.id}:`, updateError);
        continue;
      }

      remindersCreated++;
      console.log(`Sent reminder for enquiry ${enquiry.id} to seller ${listing.seller_id}`);
    }

    console.log(`Successfully sent ${remindersCreated} reminders`);

    return new Response(
      JSON.stringify({ 
        message: 'Reminders processed successfully',
        total_enquiries: enquiries.length,
        reminders_sent: remindersCreated
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in send-enquiry-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'An unknown error occurred' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});