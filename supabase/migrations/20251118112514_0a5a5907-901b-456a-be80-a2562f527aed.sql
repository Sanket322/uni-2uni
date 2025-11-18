-- Enable realtime for health monitoring
ALTER TABLE animals REPLICA IDENTITY FULL;
ALTER TABLE health_records REPLICA IDENTITY FULL;
ALTER TABLE vaccinations REPLICA IDENTITY FULL;

-- Add animals to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE animals;

-- Add health_records to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE health_records;

-- Add vaccinations to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vaccinations;