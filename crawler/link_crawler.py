from typing import Iterator
import time
from driver import Driver, WebElement
class LinkCrawler:
    def __init__(self, key_word: str) -> None:
        self.key_word = key_word
        self.url = self.__create_url()
        self.driver = Driver().open_firefox_browser()
        self.link_summary = None
        self.is_crawled = False
    def __create_url(self) -> str:
        return f"https://www.104.com.tw/jobs/search/?ro=0&kwop=7&keyword={self.key_word}&expansionType=area%2Cspec%2Ccom%2Cjob%2Cwf%2Cwktm&order=15&asc=0&page=1&mode=l&jobsource=2018indexpoc&langFlag=0&langStatus=0&recommendJob=1&hotJob=1"
    
    def _go_to_website(self) -> None:
        self.driver.open_url(self.url)
        time.sleep(3)

    @property
    def total_pages(self) -> int:
        return len(self.driver.find_element_by("class name", "gtm-paging-top").searched_element.text.split("\n"))
    
    
    def _click_manual_loading_button(self) -> None:
        button_elements = [
            element 
            for element in self.driver.find_multiple_elements_by("tag name", "button") 
            if "手動載入" in element.text 
        ]
        if len(button_elements) == 0:
            return
        button_elements.pop().click()
        time.sleep(0.5)


    @property
    def current_all_job_link_element(self) -> list[WebElement]:
        return [element for element in self.driver.find_multiple_elements_by("class name", "js-job-link")]
    
    @property
    def current_all_companies(self) -> list[str]:
        return [element.text for element in self.driver.find_multiple_elements_by("class name", "job-mode__company")[1:]]

    def _get_all_job_links(self) -> Iterator[str]:
        total_pages = self.total_pages
        for idx in range(total_pages):
            self.driver.scroll_to_buttom()
            time.sleep(1)
            self._click_manual_loading_button()
            yield f"Scrolling to page: {idx + 1} / {total_pages}" 

        self.is_crawled = True

    def filter_job_links(self, key_words: list[str]) -> list[dict[str, str]]:
        if not self.is_crawled:
            raise Exception("Please run crawl() method first")
        
        filtered = []
        for link_dict in self.link_summary:
            for key_word in key_words:
                if key_word in link_dict["job_title"]:
                    filtered.append(link_dict)
        return filtered
    
    
    def crawl(self) -> Iterator[str]:
        try:
            self._go_to_website()
            yield f"Go to 104 for scrawlling keyword: {self.key_word}"
            for message in self._get_all_job_links():
                yield message
            all_job_link_elements = self.current_all_job_link_element
            all_companies = self.current_all_companies
            
            self.link_summary = [
                {
                    "company": company, 
                    "link": element.get_attribute("href"), 
                    "job_title": element.text, 
                    "data": None
                } for element, company in zip(all_job_link_elements, all_companies)
            ]
            yield "Crawlling successfully"
        except Exception as error:
            yield f"Error: {error}"
        finally:
            self.driver.close_browser()
            yield "Browser closed."
        
