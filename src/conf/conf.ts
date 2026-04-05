const conf = {
    appwriteEndpoint:  String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectId:  String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteProjectName:  String(import.meta.env.VITE_APPWRITE_PROJECT_NAME),
    appwriteDatabaseId:  String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollectionId:  String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appwriteBucketId:  String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    tinymceApiKey:  String(import.meta.env.VITE_TINYMCE_API_KEY),
}

export default conf 

 