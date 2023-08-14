import pymongo
import copy

class DataBaseManager:
    def __init__(self, host: str, port: int) -> None:
        self.url = f"mongodb://{host}:{port}/"
        self.client = pymongo.MongoClient(self.url)

        self.collection = self.client["104"]["link_summary"]

    def _handle_doc_id(self, doc: dict[str, str]) -> dict[str, str]:
        doc["id"] = str(doc.pop("_id"))
        return doc
    
    def get_all_link_summary(self) -> list[dict[str, str]]:
        return [self._handle_doc_id(doc) for doc in self.collection.find()]

    def insert_link_doc(self, link_doc: dict[str, str]) -> None:
        if self.collection.find_one({"link": link_doc["link"]}) is not None:
            return
        self.collection.insert_one(copy.deepcopy(link_doc))

    def get_a_link_with_null_data(self) -> dict[str, str]:
        doc = self.collection.find_one({"date": None})
        if doc is None:
            raise Exception("All documents are crawled")
        return doc
    def update_data_with_query(self, query: dict[str, str], crawled_data: dict[str, str]) -> None:
        doc = self.collection.find_one(query)
        if doc is None:
            raise Exception(f"No such document for updating, query: {query}")
        doc["data"] = crawled_data
        self.collection.update_one(query, {"$set": doc})


db_manager = DataBaseManager("crawler-db", 27017)

