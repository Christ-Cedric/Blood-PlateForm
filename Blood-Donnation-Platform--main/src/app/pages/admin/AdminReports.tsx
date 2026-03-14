import React from "react";
import { AdminLayout } from "../../components/layouts";
import { Card, Typography, Button } from "../../components/ui";
import { Download, TrendingUp, TrendingDown, Users, Building2, Droplet, Calendar, Loader2 } from "lucide-react";
import { getAdminReportsApi } from "../../api";

export function AdminReports() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await getAdminReportsApi();
      setData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-10 h-10 text-[#CC0000] animate-spin" />
          <p className="text-[#888888] font-medium">Analyse des données nationales...</p>
        </div>
      </AdminLayout>
    );
  }

  const { regionalData, monthlyTrends } = data;
  const totalDonations = regionalData.reduce((acc: number, r: any) => acc + r.donations, 0);
  const totalDonors = regionalData.reduce((acc: number, r: any) => acc + r.donors, 0);
  const totalHospitals = regionalData.reduce((acc: number, r: any) => acc + r.hospitals, 0);
  const avgGrowth = (regionalData.reduce((acc: number, r: any) => acc + r.growth, 0) / regionalData.length).toFixed(1);

  const maxDonations = Math.max(...monthlyTrends.map((m: any) => m.donations));

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <Typography.H1 className="text-[32px] mb-2">Rapports et statistiques</Typography.H1>
            <Typography.Body className="text-[#888888]">
              Vue d'ensemble nationale - Mars 2026
            </Typography.Body>
          </div>
          <Button className="bg-[#1A7A3F]">
            <Download className="w-4 h-4 mr-2" />
            Exporter le rapport
          </Button>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#CC0000] to-[#990000] text-white">
            <div className="flex items-center justify-between mb-2">
              <Droplet className="w-8 h-8 opacity-80" />
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{avgGrowth}%</span>
              </div>
            </div>
            <Typography.H2 className="text-white text-3xl mb-1">{totalDonations.toLocaleString()}</Typography.H2>
            <Typography.Body className="text-white/90 text-sm">Dons réalisés (ce mois)</Typography.Body>
          </Card>

          <Card className="bg-gradient-to-br from-[#1A7A3F] to-[#0F5028] text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 opacity-80" />
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <Typography.H2 className="text-white text-3xl mb-1">{totalDonors.toLocaleString()}</Typography.H2>
            <Typography.Body className="text-white/90 text-sm">Donneurs actifs</Typography.Body>
          </Card>

          <Card className="bg-gradient-to-br from-[#D4720B] to-[#A85A09] text-white">
            <div className="flex items-center justify-between mb-2">
              <Building2 className="w-8 h-8 opacity-80" />
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+5%</span>
              </div>
            </div>
            <Typography.H2 className="text-white text-3xl mb-1">{totalHospitals}</Typography.H2>
            <Typography.Body className="text-white/90 text-sm">Hôpitaux partenaires</Typography.Body>
          </Card>

          <Card className="bg-gradient-to-br from-[#111111] to-[#333333] text-white">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 opacity-80" />
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+8%</span>
              </div>
            </div>
            <Typography.H2 className="text-white text-3xl mb-1">89%</Typography.H2>
            <Typography.Body className="text-white/90 text-sm">Taux de satisfaction</Typography.Body>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Trends */}
          <Card>
            <Typography.H2 className="mb-6">Évolution mensuelle</Typography.H2>
            <div className="flex items-end gap-3 h-64">
              {monthlyTrends.map((data: any) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#F5F5F5] rounded-t-lg flex items-end justify-center relative" style={{ height: "100%" }}>
                    <div
                      className="w-full bg-gradient-to-t from-[#CC0000] to-[#FF3333] rounded-t-lg flex items-end justify-center pb-2 transition-all hover:opacity-80 cursor-pointer"
                      style={{ height: `${(data.donations / maxDonations) * 100}%` }}
                    >
                      <span className="text-white text-xs font-semibold">{data.donations}</span>
                    </div>
                  </div>
                  <Typography.Small className="text-[#888888] font-medium">{data.month}</Typography.Small>
                </div>
              ))}
            </div>
          </Card>

          {/* Regional Distribution */}
          <Card>
            <Typography.H2 className="mb-6">Distribution régionale</Typography.H2>
            <div className="space-y-4">
              {regionalData.map((region: any) => (
                <div key={region.region} className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <Typography.Body className="font-semibold text-sm">{region.region}</Typography.Body>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Typography.Small className="text-[#888888]">{region.donations} dons</Typography.Small>
                      <div className={`flex items-center gap-1 text-xs ${region.growth > 0 ? 'text-[#1A7A3F]' : 'text-[#CC0000]'}`}>
                        {region.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(region.growth)}%
                      </div>
                    </div>
                    <div className="w-full h-2 bg-[#F5F5F5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#CC0000] to-[#FF3333] rounded-full transition-all"
                        style={{ width: `${(region.donations / totalDonations) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Detailed Regional Table */}
        <Card>
          <Typography.H2 className="mb-6">Détails par région</Typography.H2>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-['DM_Sans']">
              <thead className="bg-[#F9F9F9] text-[#888888] text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Région</th>
                  <th className="px-6 py-4 font-medium">Hôpitaux</th>
                  <th className="px-6 py-4 font-medium">Donneurs</th>
                  <th className="px-6 py-4 font-medium">Dons (ce mois)</th>
                  <th className="px-6 py-4 font-medium">Croissance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E0E0]">
                {regionalData.map((region: any) => (
                  <tr key={region.region} className="hover:bg-[#F9F9F9] transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#111111]">{region.region}</td>
                    <td className="px-6 py-4 text-[#444444]">{region.hospitals}</td>
                    <td className="px-6 py-4 text-[#444444]">{region.donors.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-[#CC0000]">{region.donations}</td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1 ${region.growth > 0 ? 'text-[#1A7A3F]' : 'text-[#CC0000]'}`}>
                        {region.growth > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-semibold">{region.growth > 0 ? '+' : ''}{region.growth}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
