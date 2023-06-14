import { intArg, objectType } from "nexus"; // to create new type in graphql schema
import { extendType, nonNull, stringArg } from "nexus";  
import { resolve } from "path";
import { NexusGenObjects } from "../../nexus-typegen";


export const Link = objectType({
    name: "Link", //define name of type
    definition(t) {  //different field that get added to the type
        t.nonNull.int("id");  //add field id of type Int
        t.nonNull.string("description"); 
        t.nonNull.string("url");
    },
});


// links variable to store the links at run time
let links: NexusGenObjects["Link"][]= [  
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

// create a feed query to return all the created link objects
export const LinkQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {  
            type: "Link",
            resolve(parent, args, context, info) {   
                return links;
            },
        });


        // get single link by its id 
        t.nonNull.field("link", {  
            type: "Link",
            args:{
               id:nonNull(intArg())
            },
            resolve(parent, args, context) {   
                const singlelink =links.find(link=>link.id===args.id);

                return singlelink;

            }
        });
    },
});

// create mutation 
export const LinkMutation = extendType({
    type:"Mutation",
    definition(t) {
        t.nonNull.field("post",{
            type:"Link",
            args:{
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent,args,content){
                const  { description, url } = args;
                let idCount = links.length + 1; 
                      const link = {
                          id: idCount,
                          description: description,
                          url: url,

                          
                      };
                      links.push(link);
                      return link;
              }
        });

        // delete single link
        t.nonNull.field("delete",{
            type:"Link",
            args:{
                id:nonNull(intArg()) 
            },
            resolve(parent, args, context) {
                const { id } = args;
                const linkIndex = links.findIndex(link => link.id === id);
            
                if (linkIndex !== -1) {
                  const deletedLink = links.splice(linkIndex, 1)[0];
                  return deletedLink;
                }
            
                return null;
            }
        });



        // update single link
        t.nonNull.field("update", {
            type: "Link",
            args: {
              id: nonNull(intArg()),
              description: nonNull(stringArg()),
              url: nonNull(stringArg())
            },
            resolve(parent, args, context) {
              const { id, description, url } = args;
              const linkIndex = links.findIndex(link => link.id === id);
      
              if (linkIndex !== -1) {
                links[linkIndex].description = description;
                links[linkIndex].url = url;
                return links[linkIndex];
              }
      
              return null;
            }
        });

       
        
    }
})