from typing import Iterator
from driver import Driver
import time
class JobInfoCrawler:
    def __init__(self) -> None:
        self.driver = Driver().open_firefox_browser()
    
    @property
    def job_info(self) -> dict[str, str]:
        job_details_value = [
            element.text for element in self.driver.find_multiple_elements_by("class name", "list-row__data") 
            if element.text != ""
        ]
        job_details_keys = [ 
            "職務類別",
            "工作待遇",
            "工作性質",
            "上班地點",
            "管理責任",
            "出差外派",
            "上班時段",
            "休假制度",
            "可上班日",
            "需求人數",
            "工作經歷",
            "學歷要求",
            "科系要求",
            "語文條件",
            "擅長工具",
            "工作技能",
            "其他條件"
        ]
        return [
            {"key": key, "value": value} for key, value in zip(job_details_keys, job_details_value)
        ]
    
    def _create_job_info(self, log: str, job_info: dict[str, str] = None, link: str = None) -> dict[str, str]:
        return {"log": log, "job_info": job_info, "link": link}

    def crawl(self, urls: list[str]) -> Iterator[dict[str, str]]:
        try:
            for idx,url in enumerate(urls):
                self.driver.open_url(url)
                time.sleep(3)
                yield self._create_job_info(f"Crawlling successfully: {url} ({idx + 1}/{len(urls)})", self.job_info, url)
        except Exception as error:
            yield self._create_job_info(str(error))
        finally:
            self.driver.close_browser()
            yield self._create_job_info("Crawlling successfully")
