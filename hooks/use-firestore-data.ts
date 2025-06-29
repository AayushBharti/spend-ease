import { firestore } from "@/config/firebase";
import {
  collection,
  onSnapshot,
  query,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFirestoreData = <T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = [],
  enabled: boolean = true
) => {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const firestoreQuery =
    collectionName && constraints.length > 0
      ? query(collection(firestore, collectionName), ...constraints)
      : null;

  useEffect(() => {
    if (!enabled || !firestoreQuery) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      firestoreQuery,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (T & { id: string })[];
        setData(fetchedData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [enabled]);

  return { data, loading, error };
};
