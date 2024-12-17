'use client';
import { useEffect, useState } from "react";
import Image from "next/image";

// Define the interface for a client
interface Client {
  id: number;
  image: string;
}

const ClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]); // Type the clients state with the Client interface
  const [loading, setLoading] = useState<boolean>(true); // To track the loading state
  const [error, setError] = useState<string | null>(null); // To track any errors

  useEffect(() => {
    // Fetch the client data from your API
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/viewClient`);
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const data: { message: string; data: Client[] } = await response.json(); // Type the response data
        setClients(data.data); // Set the clients data
      } catch (err: unknown) {
        // Ensure the error is a known type before using it
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can customize the loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Handle error state
  }

  return (
    <div className="py-12 bg-black">
      <h2 className="text-center text-2xl font-bold mb-8 text-white">Our Clients</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div key={client.id} className="flex items-center justify-center border border-gray-300 p-4">
              {client.image ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}/${client.image}`}
                  alt={`Client image ${client.id}`}
                  width={200}
                  height={100}
                  className="object-contain"
                />
              ) : (
                <div>No image available</div>
              )}
            </div>
          ))
        ) : (
          <div className="text-white text-center">No clients available</div>
        )}
      </div>
    </div>
  );
};

export default ClientsSection;
