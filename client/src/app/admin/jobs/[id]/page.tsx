'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ViewApplicantsTable from '@/components/Tables/ViewApplicantsTable';

export default function Page() {
    const params = useParams();
    const id = params?.id; 

  return (
    <div>
                  <ViewApplicantsTable jobId={typeof id === "string" ? id : undefined} />


                  <br/>
                  <br/>
                  <br/><br/><br/><br/>
     <br/>

    </div>
  );
}


