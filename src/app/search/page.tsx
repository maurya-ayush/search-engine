import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { sql } from "drizzle-orm";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}

const Page = async ({ searchParams }: PageProps) => {
    const query = searchParams.query;

    if (Array.isArray(query) || !query) {
        return redirect("/");
    }

    try {
        // Construct the SQL query
        const sqlQuery = db
            .select()
            .from(productsTable)
            .where(
                sql`to_tsvector('simple', lower(${productsTable.name} || ' ' || lower(${productsTable.description}))) @@ to_tsquery('simple', lower(${query.trim().split(" ").join(" & ")}))`
            )
            .limit(3);

        // Log the SQL query
        // console.log("SQL query:", sqlQuery.toString());

        // Execute the SQL query
        const products = await sqlQuery.execute();

        // console.log(products); // Log the query result

        // Return the result
        return <pre>{JSON.stringify(products)}</pre>;
    } catch (error) {
        console.error("Error executing SQL query:", error);
        return <div>Something went wrong</div>;
    }
};

export default Page;
