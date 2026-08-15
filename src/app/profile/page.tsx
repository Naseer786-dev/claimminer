import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Company Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input defaultValue="Acme Government Solutions" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">DUNS Number</label>
                <input defaultValue="123456789" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CAGE Code</label>
                <input defaultValue="5ABC1" className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <Button type="button">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>NAICS Codes & Capabilities</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary NAICS Codes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["541511", "541512", "541513", "541519"].map((code) => (
                    <Badge key={code} variant="secondary" className="cursor-pointer hover:bg-red-100">{code} ×</Badge>
                  ))}
                </div>
                <input placeholder="Add NAICS code..." className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Capabilities</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {["IT Support", "Cybersecurity", "Cloud Services", "Software Dev"].map((cap) => (
                    <Badge key={cap} variant="secondary" className="cursor-pointer hover:bg-red-100">{cap} ×</Badge>
                  ))}
                </div>
                <input placeholder="Add capability..." className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Set-Aside Certifications</label>
                <div className="space-y-2">
                  {["Small Business", "Woman-Owned (WOSB)", "SDVOSB", "HubZone", "8(a)"].map((cert) => (
                    <label key={cert} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked={["Small Business", "Woman-Owned (WOSB)"].includes(cert)} className="rounded" />
                      {cert}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Subscription</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div>
                <p className="font-semibold text-blue-900">Starter Plan</p>
                <p className="text-sm text-blue-700">5 alerts · 500 RFPs/month · Email notifications</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-900">$99<span className="text-sm font-normal">/mo</span></p>
                <Button size="sm" variant="outline" className="mt-2">Upgrade to Pro</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
