import {Extraction} from "../lib/redux/features/documents/documentsSlice";
import {Card, CardContent, CardDescription, CardHeader} from "./shadcn/card";

export const ExtractionCard = ({content, id}: Extraction) => {

    return (
        <Card className="w-full">
            <CardHeader>
                <CardDescription className="text-xs">{id}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm font-bold">
                {content}
            </CardContent>
        </Card>
    )
}