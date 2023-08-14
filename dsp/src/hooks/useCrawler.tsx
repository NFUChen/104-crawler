import axios from "axios";
import { useState } from "react";

function convertToTypeScriptConvention(obj: any): any {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  const result: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelCaseKey = key.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());
      result[camelCaseKey] = convertToTypeScriptConvention(obj[key]);
    }
  }

  return result;
}

export interface ILink {
  id: string;
  company: string;
  jobTitle: string;
  link: string;
}

export interface IJobDetail {
  id: string;
  company: string;
  jobTitle: string;
  data?: null | string;
}

export const useCrawler = () => {
  const url = "http://localhost:8099";
  const [allLinks, setAllLinks] = useState<ILink[]>([]);
  const [isCrawlling, setIsCrawlling] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRestartingBrowser, setIsRestartingBrowser] = useState<boolean>(false);
  const [response, setResponse] = useState<any>(null);

  const getAllLinks = async () => {
    const response = await axios.get(`${url}/get_all_links`);
    setAllLinks(
      response.data.data.map((link: any) => {
        return convertToTypeScriptConvention(link);
      })
    );
  };

  const getLogs = async () => {
    const response = await axios.get(`${url}/get_logs`);
    setLogs(response.data.data);
  };

  const crawlJobInfos = async (links: string[]) => {
    try {
      setIsCrawlling(true);
      const response = await axios.post(`${url}/crawl_job_info`, { urls: links });
      setIsCrawlling(false);
    } catch (error) {
      setIsCrawlling(false);
    }
  };

  const crawlLinks = async (keyword: string) => {
    try {
      setIsCrawlling(true);
      const response = await axios.post(`${url}/crawl_links`, { key_word: keyword });
      setIsCrawlling(false);
    } catch (error) {
      setIsCrawlling(false);
    }
  };

  const restartBrowser = async () => {
    try {
      setIsRestartingBrowser(true);
      const response = await axios.get(`${url}/restart_browser`);
      setIsRestartingBrowser(false);
      setResponse(response.data);
    } catch (error) {
      setIsRestartingBrowser(false);
    }
  };

  const clearLogs = async () => {
    const response = await axios.get(`${url}/clear_logs`);
  }

  const resetResponse = () => {
    setResponse(null);
  };

  return {
    allLinks,
    getAllLinks,
    isCrawlling,
    crawlJobInfos,
    crawlLinks,
    restartBrowser,
    isRestartingBrowser,
    response,
    resetResponse: resetResponse,
    getLogs,
    logs,
    clearLogs
  };
};
