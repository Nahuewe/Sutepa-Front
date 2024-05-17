import { useEffect } from "react";
import Card from "@/components/ui/Card";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";
import { useAuthStore, useIngresoStore } from "../../helpers";
import RevenueBarChart from "../../components/ui/RevenueBarChart";
import DonutChart from "../../components/ui/DonutChart";

const Dashboard = () => {
  const { ingresos, startLoadingIngreso } = useIngresoStore();
  const { user: { sucursal } } = useAuthStore();

  const gridColumns = sucursal !== 1 ? "md:grid-cols-4" : "md:grid-cols-4";

  useEffect(() => {
    startLoadingIngreso();
  }, []);

  return (
    <div>
      <Card title="SUTEPA">
        <div className="flex justify-between">
          <p className="text-lg mx-0 my-auto hidden md:flex">Dashboard</p>
          {sucursal === 1 && (
            <div className="flex items-center">
              <button className="bg-slate-300 dark:bg-slate-900 inline-block text-center px-6 py-2 rounded-lg">
                Exportar
              </button>
            </div>
          )}
        </div>
      </Card>

      <div className={`mt-4 grid ${gridColumns} sm:grid-cols-2 grid-cols-1 gap-4`}>
        <GroupChart4 ingresos={ingresos} />
      </div>

      <div className="mt-4 grid ${gridColumns} sm:grid-cols-2 grid-cols-1 gap-4">
        <DonutChart />
        
        <RevenueBarChart />
      </div>
    </div>
  );
};

export default Dashboard;
