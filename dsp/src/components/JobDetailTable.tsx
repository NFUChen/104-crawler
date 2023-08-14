import { Tooltip } from "@mui/material";
import { IJobDetail } from "../hooks/useCrawler";

const JobDetailCard = ({ data }: { data: { key: string; value: string }[] }) => {
  return (
    <div className="overflow-y-auto w-auto py-3">
      {data.map((item, idx) => {
        return (
          <div key={idx} className="flex space-x-2 w-auto h-auto border-b-2 border-white/20 px-5">
            <div className="flex justify-center items-center w-[20%]">
              <p className="text-white">{item.key}</p>
            </div>
            <div className="w-[80%] flex justify-start items-center hover:text-sm duration-300">
              <p className="text-white text-justify">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const InfoIconTooltip = ({ data }: { data: any }) => {
  return (
    <Tooltip placement="right" title={<JobDetailCard data={Object.values(data)}/>}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="hover:stroke-2 w-10 h-10 cursor-pointer m-auto hover:-translate-y-1 duration-300"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    </Tooltip>
  );
};

export const JobDetailTable = ({ title, rows }: { title: string; rows: IJobDetail[] }) => {
  return (
    <div className="flex flex-col items-center w-full h-full p-3 space-y-3">
      <p className="text-white text-3xl">{title}</p>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr className="text-white text-center text-lg">
              <th></th>
              <th>公司</th>
              <th>職稱</th>
              <th>詳細資訊</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {rows.map((row, idx) => {
              return (
                <tr key={row.id} className="hover:bg-white/20 text-white text-center items-center">
                  <td>{idx + 1}</td>
                  <td>{row.company}</td>
                  <td>{row.jobTitle}</td>
                  <td>{<InfoIconTooltip data={row.data} />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
