import { useCrawler } from "../hooks/useCrawler";
import { LinkTable } from "./LinkTable";
import { useEffect, useState } from "react";
import { Button, Tooltip } from "@mui/material";
import { BroswserLogPanel } from "./BrowserLogPanel";
import { JobDetailTable } from "./JobDetailTable";

interface IButton {
  label: string;
  toolTipText: string;
  isDisable: boolean;
  onClick?: () => void;
}

interface IInputField {
  setter: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  buttonProps: IButton;
}
const InputField = ({ setter, label, buttonProps }: IInputField) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };
  return (
    <div className="form-control w-full flex space-y-2">
      <label className="label">
        <span className="label-text text-white">{label}</span>
      </label>
      <input
        onChange={handleChange}
        type="text"
        placeholder="關鍵字"
        className="input input-bordered w-full bg-white/20"
      />
      <Tooltip title={buttonProps.toolTipText} placement="top">
        <Button disabled={buttonProps.isDisable} variant="contained" onClick={buttonProps.onClick}>
          {buttonProps.label}
        </Button>
      </Tooltip>
    </div>
  );
};

export const DashBoard = () => {
  const [linkKey, setLinkKey] = useState<string>("");
  const [filterKey, setFilterKey] = useState<string>("");
  const { allLinks, getAllLinks, crawlLinks, crawlJobInfos, isCrawlling, getLogs, logs } = useCrawler();
  useEffect(() => {
    getAllLinks();
    getLogs();
  }, []);
  const targetLinks = allLinks.filter(link => link.jobTitle.includes(filterKey));
  const scralledLinks = targetLinks.filter(link => link.data !== null);
  const unscralledLinks = targetLinks.filter(link => link.data === null);
  console.log(scralledLinks);

  const handleCrawlLinks = () => {
    if (linkKey.length === 0) {
      return;
    }
    crawlLinks(linkKey);
  };

  const handleCrawlJobInfos = () => {
    if (filterKey.length === 0) {
      return;
    }
    crawlJobInfos(unscralledLinks.map(link => link.link));
  };

  const inputFields: IInputField[] = [
    {
      setter: setLinkKey,
      label: "請輸入關鍵字",
      buttonProps: {
        isDisable: isCrawlling,
        label: "爬取工作資料連結",
        toolTipText: "此按鈕將重新抓取工作資料連接以供後續爬取",
        onClick: handleCrawlLinks
      }
    },
    {
      setter: setFilterKey,
      label: "請輸入過濾關鍵字",
      buttonProps: {
        isDisable: isCrawlling,
        label: "爬取詳細工作資料",
        toolTipText: "此按鈕將針對過濾完之列表(尚未抓取)進行爬取",
        onClick: handleCrawlJobInfos
      }
    }
  ];
  return (
    <div className="h-screen w-screen flex p-5">
      <div className="h-full w-[60%] flex flex-col space-y-5 justify-center">
        <div className="h-[45%] w-full bg-white/20 rounded-lg">
          <LinkTable title={"尚未抓取"} rows={unscralledLinks} />
        </div>
        <div className="h-[45%] w-full bg-white/20 rounded-lg">
          <JobDetailTable title={"已抓取"} rows={scralledLinks} />
        </div>
      </div>
      <div className="h-full w-[40%] flex items-start p-5 flex-col">
        <div className="h-auto w-full flex flex-col p-5">
          {inputFields.map(({ setter, label, buttonProps }, idx) => {
            return <InputField key={idx} setter={setter} label={label} buttonProps={buttonProps} />;
          })}

          <div className="flex w-full justify-between"></div>
        </div>
        <div className="h-[60%] w-full">
          <BroswserLogPanel />
        </div>
      </div>
    </div>
  );
};
