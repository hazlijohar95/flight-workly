
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import useRequireAuth from "@/hooks/useRequireAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

type BetaInvite = {
  id: string;
  email: string;
  code: string;
  used: boolean;
  created_at: string;
  used_at: string | null;
};

export default function BetaInvites() {
  useRequireAuth({ requireAdmin: true });
  const [invites, setInvites] = useState<BetaInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvites, setSelectedInvites] = useState<string[]>([]);

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const { data, error } = await supabase
        .from("beta_invites")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvites(data || []);
    } catch (error: any) {
      toast.error(`Error loading invites: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InviteFormValues) => {
    try {
      const code = generateInviteCode();
      const { error } = await supabase.from("beta_invites").insert({
        email: data.email,
        code,
        used: false,
      });

      if (error) {
        // Check for unique violation error
        if (error.code === "23505") {
          toast.error("This email already has an invite");
          return;
        }
        throw error;
      }

      toast.success(`Invite created for ${data.email}`);
      form.reset();
      fetchInvites();
    } catch (error: any) {
      toast.error(`Error creating invite: ${error.message}`);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedInvites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedInvites.length) return;
    
    try {
      const { error } = await supabase
        .from("beta_invites")
        .delete()
        .in("id", selectedInvites);

      if (error) throw error;
      
      toast.success(`Deleted ${selectedInvites.length} invite(s)`);
      setSelectedInvites([]);
      fetchInvites();
    } catch (error: any) {
      toast.error(`Error deleting invites: ${error.message}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Beta Invites</h1>
          <p className="text-muted-foreground">
            Manage beta access invitations for your platform
          </p>
        </div>

        <div className="bg-white rounded-md shadow p-6">
          <h2 className="text-lg font-medium mb-4">Create New Invite</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Invite</Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="bg-white rounded-md shadow">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium">Invite List</h2>
            {selectedInvites.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected ({selectedInvites.length})
              </Button>
            )}
          </div>
          
          {loading ? (
            <div className="p-8 text-center">Loading invites...</div>
          ) : invites.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No invites created yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-12 px-4 py-3 text-left">
                      <Checkbox
                        checked={
                          selectedInvites.length > 0 &&
                          selectedInvites.length === invites.length
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedInvites(invites.map((invite) => invite.id));
                          } else {
                            setSelectedInvites([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Invite Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invites.map((invite) => (
                    <tr key={invite.id}>
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedInvites.includes(invite.id)}
                          onCheckedChange={() => handleToggleSelect(invite.id)}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm">{invite.email}</td>
                      <td className="px-4 py-4 text-sm font-mono">
                        {invite.code}
                      </td>
                      <td className="px-4 py-4">
                        {invite.used ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Used
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
