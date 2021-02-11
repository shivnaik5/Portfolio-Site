import { gql } from "@apollo/client";

export const HOME_QUERY = gql`
{
 homeCollection {
   items {
     headline
   }
 }
}`;
