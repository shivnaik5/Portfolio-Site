import { useQuery } from "@apollo/client";

import React, { useEffect, useState } from 'react'
// import { API, graphqlOperation } from 'aws-amplify'

// const query = `
//   query {
//     listTodos {
//       items {
//         id
//         name
//         description
//       }
//     }
//   }
// `

const useContentQuery = query => {
  const [contentData, setContentData] = useState(null);

  useEffect(async () => {
      const { loading, error, data } = useQuery(query);
      if (data) setContentData(data.homeCollection.items[0]);
      if (error) console.log('error: ', err)
  }, [])

  return contentData;
}

export default useContentQuery;
