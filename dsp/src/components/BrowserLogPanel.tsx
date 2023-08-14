import { Button } from "@mui/material";
import { useSocket } from "../hooks/useSocket";
import { useCrawler } from "../hooks/useCrawler";

export const BroswserLogPanel = () => {
  const { data } = useSocket("http://localhost:8099", "on_log_resp", {});
  const { restartBrowser, isRestartingBrowser, clearLogs } = useCrawler();

  const handleClearLogs = () => {
    clearLogs();
  }

  return (
    <>
      <div className="h-full w-full bg-white/20 p-5 rounded-lg flex flex-col items-center space-y-4">
        <p className="text-lg font-bold">瀏覽器狀態</p>
        <div className="h-[90%] flex flex-col overflow-auto self-start w-full">
          {data.data?.map((log: string, idx: number) => {
            return (
              <p key={idx} className="text-white">
                {log}
              </p>
            );
          })}
        </div>
        <div className="h-[10%] flex justify-center w-full space-x-3">
          <Button variant="contained" color="primary" className="grow text-white">
            清除
          </Button>
          <Button
            disabled={isRestartingBrowser}
            variant="contained"
            color="primary"
            className="grow"
            onClick={restartBrowser}
          >
            重啟FireFox
          </Button>
        </div>
      </div>
    </>
  );
};
