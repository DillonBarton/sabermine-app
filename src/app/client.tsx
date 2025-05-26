"use client"

import {unapprovedDocumentContentSelector} from "../lib/redux/features/documents/documentsSlice";
import {useAppSelector} from "../lib/redux/hooks";

const Client = () => {

    const documentContent = useAppSelector((store) => unapprovedDocumentContentSelector(store))

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="rounded-xl shadow-lg w-[60%] h-full mx-auto p-16 flex flex-col gap-2">
                <p>{documentContent}</p>
                <span className="text-green-500 text-xxl font-semibold">{!documentContent ? "All Approved" : ""}</span>
            </div>
        </div>
    );
};

export default Client;