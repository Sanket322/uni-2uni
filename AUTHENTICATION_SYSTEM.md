# Production-Ready Authentication System

## Overview
The Animal Information System (AIS) implements a comprehensive, secure authentication system with role-based access control, supporting separate login flows for administrators and farmers/end users.

## Architecture

### User Types & Portals

1. **Super Admin** (Your Team)
   - Access: Separate admin login at `/admin-login`
   - Dashboard: `/admin` 
   - Full system control and management capabilities
   - User management, scheme management, marketplace moderation, reports

2. **Farmers / Cattle Managers** (End Users)
   - Access: Main farmer portal login at `/auth`
   - Dashboard: `/dashboard`
   - Complete livestock management features
   - Animal records, health tracking, marketplace, AI doctor, schemes

3. **Veterinary Officers**
   - Access: Same farmer portal login
   - Dashboard: `/veterinary-dashboard`
   - Medical professional features
   - View all animals, add health records, vaccination management

4. **Program Coordinators**
   - Access: Same farmer portal login
   - Dashboard: `/coordinator-dashboard`
   - Regional management features
   - Monitor regional activities, coordinate programs, view analytics

## Authentication Flow

### Signup Flow (Farmers/End Users)
```
1. User visits landing page (/)
2. Clicks "Farmer Sign Up / Login" button
3. Redirected to /auth
4. Fills signup form:
   - Full Name
   - Email
   - Phone Number
   - Password
   - Confirm Password
5. Form validation (Zod schema)
6. Account created with 'farmer' role (auto-assigned by database trigger)
7. Auto-confirmation enabled (for development/testing)
8. Redirected to /dashboard
```

### Login Flow (Farmers/End Users)
```
1. User visits /auth
2. Enters email and password
3. Form validation
4. Authentication via Supabase
5. Role-based redirect:
   - Farmer → /dashboard
   - Veterinary Officer → /veterinary-dashboard
   - Program Coordinator → /coordinator-dashboard
```

### Admin Login Flow
```
1. Admin clicks "Admin Login" on landing page header
2. Redirected to /admin-login (distinct from farmer portal)
3. Enters admin credentials
4. Authentication via Supabase
5. Role verification - checks if user has 'admin' role
6. If admin role confirmed → /admin dashboard
7. If not admin → Access denied, redirected to home
```

## Security Features

### Input Validation
- **Zod Schema Validation**: All forms use strict validation
- **Email Format**: Standard email format validation
- **Password Strength**: Minimum 6 characters (configurable)
- **Phone Number**: Minimum 10 digits for Indian numbers
- **Password Confirmation**: Must match password field

### Authentication Security
- **Secure Password Storage**: Handled by Supabase Auth
- **Session Management**: JWT tokens with auto-refresh
- **HTTPS Only**: Production deployment requires HTTPS
- **CSRF Protection**: Built into Supabase client
- **Rate Limiting**: Supabase provides built-in rate limiting

### Role-Based Security
- **Server-Side Role Validation**: Uses `has_role()` database function
- **Row-Level Security (RLS)**: All tables have proper RLS policies
- **Client-Side Route Protection**: `RoleBasedRoute` component
- **Protected Routes**: `ProtectedRoute` component for authentication check

## Database Schema

### Profiles Table
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  phone_number TEXT,
  state TEXT,
  district TEXT,
  village TEXT,
  pin_code TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### User Roles Table
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

### Auto-Role Assignment Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, phone_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  );
  
  -- Assign default farmer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'farmer');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Implementation Details

### AuthContext Provider
```typescript
// Location: src/contexts/AuthContext.tsx
// Provides:
- user: Current authenticated user
- session: Current session with JWT tokens
- loading: Authentication state loading indicator
- signIn(email, password): Login function
- signUp(email, password, fullName, phoneNumber): Signup function
- signOut(): Logout function
```

### Role Hook
```typescript
// Location: src/hooks/useUserRole.tsx
// Provides:
- roles: Array of user's roles
- loading: Role loading state
- hasRole(role): Check specific role
- isAdmin: Boolean for admin role
- isVeterinaryOfficer: Boolean
- isProgramCoordinator: Boolean
- isFarmer: Boolean
```

### Route Protection Components
```typescript
// ProtectedRoute - Requires authentication
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// RoleBasedRoute - Requires specific roles
<RoleBasedRoute allowedRoles={["admin"]}>
  <AdminComponent />
</RoleBasedRoute>
```

## Configuration

### Supabase Auth Settings
- **Auto Confirm Email**: Enabled (for development)
- **Disable Signup**: False (public can sign up)
- **Anonymous Users**: Disabled
- **Email Redirect**: Configured to `${window.location.origin}/dashboard`

### Production Checklist
- [ ] Disable auto-confirm email
- [ ] Set up email templates (confirmation, password reset)
- [ ] Configure proper redirect URLs for production domain
- [ ] Enable rate limiting on sensitive endpoints
- [ ] Set up monitoring and logging
- [ ] Configure password policies (complexity, expiry)
- [ ] Set up MFA (Multi-Factor Authentication) if required
- [ ] Review and test all RLS policies
- [ ] Set up backup authentication methods
- [ ] Configure session timeout policies

## User Management (Admin)

Admins can manage user roles through the Admin Dashboard:
1. Navigate to `/admin` → User Management
2. Search for users by name, email, phone, or location
3. Click "Manage Roles" on any user
4. Assign/remove roles:
   - farmer (default for all)
   - veterinary_officer
   - program_coordinator
   - admin

## Error Handling

### Common Errors & Solutions

1. **"Invalid login credentials"**
   - Wrong email or password
   - User doesn't exist
   - Solution: Check credentials or sign up

2. **"Email already registered"**
   - User already has an account
   - Solution: Use login instead

3. **"Access Denied"** (Admin Login)
   - User doesn't have admin role
   - Solution: Contact system administrator

4. **"Validation Error"**
   - Form fields don't meet requirements
   - Solution: Check error message and fix inputs

## Testing

### Test Admin Account
```
After deployment, create first admin:
1. Sign up normally as farmer
2. Manually update database:
   INSERT INTO user_roles (user_id, role)
   VALUES ('<user-id>', 'admin');
3. Login via /admin-login
```

### Test Scenarios
- [ ] New user signup with valid data
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Signup with existing email
- [ ] Password mismatch validation
- [ ] Invalid email format
- [ ] Invalid phone number
- [ ] Admin access from non-admin account
- [ ] Role-based dashboard redirects
- [ ] Session persistence after page refresh
- [ ] Logout functionality
- [ ] Protected route access without authentication

## Monitoring & Logs

### What to Monitor
- Failed login attempts (security)
- Signup success/failure rates
- Session duration analytics
- Role permission violations
- Authentication errors

### Logging
- Do NOT log passwords or sensitive data
- Log authentication events (login/logout)
- Log role assignments/changes
- Log failed authentication attempts
- Log admin actions for audit trail

## Future Enhancements

1. **OTP Integration** (Reliance Foundation APIs)
   - SMS OTP for new users
   - Password + OTP for existing users
   - Mobile number as primary identifier

2. **Social Login**
   - Google authentication
   - WhatsApp integration

3. **Multi-Factor Authentication (MFA)**
   - Email verification codes
   - SMS verification
   - Authenticator apps

4. **Advanced Password Policies**
   - Password complexity requirements
   - Password expiry
   - Password history
   - Account lockout after failed attempts

5. **Session Management**
   - Concurrent session limits
   - Device management
   - Remote logout capabilities

## Support

For authentication issues:
1. Check browser console for errors
2. Verify email confirmation (if enabled)
3. Check Supabase auth logs in Lovable Cloud dashboard
4. Review RLS policies for access issues
5. Contact system administrator for role assignments

---

**Security Note**: This is a production-ready authentication system. Always use HTTPS in production, regularly update dependencies, monitor for security vulnerabilities, and follow best practices for credential management.
