# Role-Based Access Control System

## Overview
The Animal Information System (AIS) implements a comprehensive role-based access control (RBAC) system with four distinct user roles, each with specific permissions and access levels.

## User Roles

### 1. Farmer (Default Role)
**Access Level**: Basic
- Manage own animals (add, view, edit, delete)
- Record health information
- Track vaccinations and breeding
- Create feeding schedules
- Access marketplace (buy/sell livestock)
- Use AI Pashu Doctor
- View government schemes
- Access emergency contacts
- View own notifications

### 2. Veterinary Officer
**Access Level**: Medical Professional
All Farmer permissions PLUS:
- View all animals in their assigned region
- Add health records for any animal
- Add vaccination records
- Provide expert AI Doctor reviews
- Access advanced health analytics
- View regional disease patterns

### 3. Program Coordinator
**Access Level**: Regional Management
All Farmer permissions PLUS:
- View all animals and users in their region
- Access regional reports and analytics
- Coordinate training and events
- Manage regional notifications
- View scheme implementation data

### 4. Admin
**Access Level**: Full System Access
All permissions PLUS:
- **User Management**: Create, edit, delete users and assign roles
- **Scheme Management**: Add, edit, delete government schemes
- **Notification Management**: Send system-wide notifications
- **Marketplace Moderation**: Approve, reject, or remove listings
- **Content Management**: Manage CMS content (future)
- **Reports & Analytics**: Access comprehensive system reports
- **System Configuration**: Configure system settings

## Implementation

### Role Assignment
Roles are stored in the `user_roles` table with proper RLS policies:
```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE TYPE app_role AS ENUM (
  'farmer',
  'veterinary_officer',
  'program_coordinator',
  'admin'
);
```

### Role Checking Function
A secure database function checks roles server-side:
```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### Frontend Usage

#### Check User Roles
```typescript
import { useUserRole } from "@/hooks/useUserRole";

function MyComponent() {
  const { isAdmin, isVeterinaryOfficer, isProgramCoordinator, isFarmer, loading } = useUserRole();

  if (loading) return <div>Loading...</div>;

  if (isAdmin) {
    return <AdminContent />;
  }

  return <FarmerContent />;
}
```

#### Protect Routes
```typescript
import RoleBasedRoute from "@/components/RoleBasedRoute";

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>
```

## Admin Dashboard Features

### User Management
- View all registered users
- Filter by role, state, district
- Search by name, phone, location
- Assign/remove roles
- View user statistics

### Scheme Management
- Add new government schemes
- Edit existing schemes
- Set eligibility criteria and benefits
- Manage required documents
- Regional targeting (state/district)
- Active/inactive status control

### Notification Management
- Send broadcast notifications
- Target specific user groups
- Priority levels (low, medium, high, critical)
- Notification types (vaccination, emergency, events)
- Track delivery and read status

### Marketplace Moderation
- Review all marketplace listings
- Approve or reject listings
- Mark items as sold/inactive
- Track listing statistics
- Moderate content and reports

### Reports & Analytics
- System-wide statistics
- User engagement metrics
- Health record trends
- Vaccination coverage
- Marketplace activity
- Export to PDF/CSV

## Security Considerations

### Critical Security Rules
1. **Server-Side Validation**: Always validate roles on the backend
2. **RLS Policies**: Use Row-Level Security for data access control
3. **No Client-Side Trust**: Never trust client-side role checks for sensitive operations
4. **Audit Logging**: Log all admin actions for accountability
5. **Principle of Least Privilege**: Grant minimum necessary permissions

### RLS Policy Examples
```sql
-- Only admins can view all users
CREATE POLICY "Admins can view all users"
ON public.profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Vet officers can add health records
CREATE POLICY "Vet officers can insert health records"
ON public.health_records
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'veterinary_officer') OR 
  has_role(auth.uid(), 'admin')
);
```

## Mobile Responsiveness

All admin pages are fully mobile-responsive:
- Tables collapse and stack on mobile
- Action buttons adapt to smaller screens
- Touch-friendly UI elements
- Optimized data display for tablets
- Progressive disclosure of information

### Responsive Design Patterns
- Hidden columns on smaller screens (using Tailwind's `hidden md:table-cell`)
- Stacked cards instead of wide tables on mobile
- Collapsible sections for detailed information
- Bottom sheet menus for actions
- Swipeable tabs for navigation

## Role Assignment Process

### Default Assignment
- All new users automatically receive the "farmer" role
- Triggered by `handle_new_user()` database function

### Admin Assignment
1. Admin navigates to User Management
2. Searches for user
3. Clicks "Manage Roles" button
4. Selects additional roles to assign
5. Changes are logged and applied immediately

### Multiple Roles
Users can have multiple roles simultaneously:
```typescript
// User can be both farmer and veterinary_officer
const user = {
  roles: ['farmer', 'veterinary_officer']
};
```

## Future Enhancements

### Planned Features
1. **Custom Permissions**: Fine-grained permission controls
2. **Role Templates**: Predefined role configurations
3. **Delegation**: Temporary role assignment
4. **Regional Admins**: State/district level administrators
5. **Audit Trail**: Comprehensive activity logging
6. **Role Requests**: Users can request role upgrades
7. **Approval Workflow**: Multi-step role approval process

## Testing Role-Based Access

### Test Users
For development/testing, create users with different roles:

```sql
-- Create test admin
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'admin');

-- Create test vet officer
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid', 'veterinary_officer');
```

### Testing Checklist
- [ ] Farmer can only see own data
- [ ] Vet officer can add health records
- [ ] Program coordinator can view regional data
- [ ] Admin can access all management features
- [ ] Role restrictions enforce properly
- [ ] Unauthorized access redirects correctly
- [ ] Mobile UI functions on all roles

## Support & Documentation

For additional information:
- Review RLS policies in database migrations
- Check `src/hooks/useUserRole.tsx` for implementation
- See `src/components/RoleBasedRoute.tsx` for route protection
- Refer to admin page components for management UI examples

---

**Note**: This role system is designed to scale with the AIS platform. As new features are added, role permissions should be reviewed and updated accordingly.
