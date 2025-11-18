import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Edit, Mail, Phone, Calendar, UserCog } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type { Enums } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type UserRole = Enums<"app_role">;

interface UserData {
  id: string;
  full_name: string;
  phone_number: string | null;
  email: string;
  created_at: string;
  roles: UserRole[];
  subscription_status: string | null;
  subscription_end: string | null;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const { toast } = useToast();
  const { startImpersonation } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profileError) throw profileError;

      const usersData: UserData[] = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Fetch roles
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", profile.id);

          // Fetch subscription
          const { data: subscription } = await supabase
            .from("user_subscriptions")
            .select("status, end_date")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          // Get email from auth (admins can see this)
          const { data: { user } } = await supabase.auth.admin.getUserById(profile.id);

          return {
            id: profile.id,
            full_name: profile.full_name || "N/A",
            phone_number: profile.phone_number || null,
            email: user?.email || "N/A",
            created_at: profile.created_at || new Date().toISOString(),
            roles: roleData?.map((r) => r.role) || [],
            subscription_status: subscription?.status || null,
            subscription_end: subscription?.end_date || null,
          };
        })
      );

      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone_number?.includes(searchQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleRoleUpdate = async (userId: string, role: UserRole, isAdding: boolean) => {
    try {
      if (isAdding) {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Role ${isAdding ? "added" : "removed"} successfully`,
      });

      fetchUsers();
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleCreateAdmin = async () => {
    try {
      if (!newAdminEmail || !newAdminName) {
        toast({
          title: "Validation Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      // Generate random password
      const tempPassword = Math.random().toString(36).slice(-12) + "A1!";

      // Create user
      const { data: newUser, error: signUpError } = await supabase.auth.admin.createUser({
        email: newAdminEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          full_name: newAdminName,
        },
      });

      if (signUpError) throw signUpError;

      if (newUser.user) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: newUser.user.id, role: "admin" });

        if (roleError) throw roleError;

        toast({
          title: "Admin Created",
          description: `Admin account created. Temporary Password: ${tempPassword}`,
          duration: 10000,
        });

        setCreateAdminOpen(false);
        setNewAdminEmail("");
        setNewAdminName("");
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Error creating admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "veterinary_officer":
        return "default";
      case "program_coordinator":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage users, roles, and permissions</p>
        </div>
        <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Admin Account</DialogTitle>
              <DialogDescription>
                Create a new administrator account with auto-generated password
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-name">Full Name</Label>
                <Input
                  id="admin-name"
                  placeholder="Admin Name"
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateAdmin} className="w-full">
                Create Admin Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Find users by name, email, or phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.full_name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.phone_number && (
                          <div className="flex items-center text-sm gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone_number}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role} variant={getRoleBadgeColor(role)}>
                                {role.replace("_", " ")}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline">No roles</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.subscription_status ? (
                          <Badge variant={user.subscription_status === "active" ? "default" : "secondary"}>
                            {user.subscription_status}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">No subscription</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              startImpersonation(user.id);
                              toast({
                                title: "Impersonating User",
                                description: `Now viewing as ${user.full_name}`,
                              });
                              navigate("/dashboard");
                            }}
                          >
                            <UserCog className="h-4 w-4 mr-1" />
                            Impersonate
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Assign or remove roles for {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Available Roles</Label>
                {(["admin", "veterinary_officer", "program_coordinator", "farmer"] as UserRole[]).map((role) => {
                  const hasRole = selectedUser.roles.includes(role);
                  return (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={role}
                        checked={hasRole}
                        onCheckedChange={(checked) =>
                          handleRoleUpdate(selectedUser.id, role, checked as boolean)
                        }
                      />
                      <label htmlFor={role} className="text-sm font-medium cursor-pointer capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {role.replace("_", " ")}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
