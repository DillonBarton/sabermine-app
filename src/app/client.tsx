"use client"

import {approvedDocumentsSelector} from "../lib/redux/features/documents/documentsSlice";
import {useAppSelector} from "../lib/redux/hooks";

const Client = () => {

    const documents = useAppSelector((store) => approvedDocumentsSelector(store))

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="rounded-xl shadow-lg w-[60%] h-full mx-auto p-16 flex flex-col gap-2">
                {documents.map((doc) => <p key={doc.content}>{doc.content}</p>)}
            </div>
        </div>
    );
};

export default Client;