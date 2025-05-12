"use client"

import {faker} from "@faker-js/faker";

const Client = () => {


    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="rounded-xl shadow-lg w-[60%] h-full mx-auto p-16 flex flex-col gap-2">
                <p>{faker.lorem.paragraphs({min: 1, max: 5})}</p>
            </div>
        </div>
    );
};

export default Client;