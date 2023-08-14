import { ILink } from "../hooks/useCrawler";

export function LinkTable({ title, rows }: { title: string; rows: ILink[] }) {
  return (
    <div className="flex flex-col items-center w-full h-full p-3 space-y-3">
      <p className="text-white text-3xl">{title}</p>
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr className="text-white text-center text-lg">
              <th></th>
              <th>公司</th>
              <th>職稱</th>
              <th>超連結</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {rows.map((row, idx) => (
              <tr key={row.id} className="hover:bg-white/20 text-white text-center">
                <td>{idx + 1}</td>
                <td>{row.company}</td>
                <td>{row.jobTitle}</td>
                <td>
                  <a href={row.link} target="_blank" className="underline" rel="noreferrer">
                    {row.link}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
