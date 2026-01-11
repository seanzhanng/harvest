'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ItemPage() {
    // useParams() returns an object where the keys are the names of the parameters 
    // defined in route path and the values are the corresponding segments from the actual URL
    const params = useParams();
    const id = params.id;
    const [item, setItem] = useState<string[]>([]);
    const[loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async() => {
            try {
                //const response = await fetch('GET Endpoint') with {id} in the URL
                //const data = await response.json()
                //setItem(data)
                setItem(["apple"])
            } catch (error) {
                console.error('Failed to fetch item:', error);
            } finally {
                setLoading(false)
            }
        };

        if (id) fetchItem();
    }, [id])

    if (loading) return <div>Loading...</div>
    if (!item) return <div>Item not found</div>
  
    return (
        <div>
            <h1>{'item.name'}</h1>
            <h1>recipes for this item</h1>
            <p>{'item.recipe'}</p>
        </div>
  );
}