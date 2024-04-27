import { db } from "@/db"
import { productTable } from "@/db/schema"
import { sql } from "drizzle-orm"
import { redirect } from "next/navigation"

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Page = async ({searchParams}: PageProps) => {
    const query = searchParams.query
    
    if(Array.isArray(query) || !query) {
        return redirect("/")
    }

    let products = await db
    .select()
    .from(productTable)
    .where(
        sql`to_tsvector('simple', lower(${productTable.name} || ' ' || lower${
            productTable.description
        })) @@ to_tsquery('simple', lower(${query
            .trim()
            .split(' ')
            .join(' & ')}))`
    ).limit(3)

    return (
        <pre>{JSON.stringify(products)}</pre>
    )
}

export default Page