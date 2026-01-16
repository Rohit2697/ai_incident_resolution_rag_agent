from app.db.mongo import collections

def get_all_collection_worker(userId:str):
    try:
        all_collection_by_user=collections.find_one({"userId": userId},{"_id":0,"collections.collection_name":1})
        if not all_collection_by_user:
            return {
            "ok": True,
            "error_code": None,
            "message": "No collections found",
            "data": []
        }
        return {
            "ok": True,
            "error_code": None,
            "message": "collections retrieved",
            "data":[c["collection_name"] for c in all_collection_by_user["collections"]]
        }
    except Exception as e:
        return {
            "ok": False,
            "error_code": "collection_retrieval_failed",
            "message": f"Unable to retrieve collections: {str(e)}",
            "data": []
        }