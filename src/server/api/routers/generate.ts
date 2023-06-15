import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {createTRPCRouter, protectedProcedure} from "~/server/api/trpc";
import{ Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";
  
const configuration = new Configuration({
      apiKey: env.DALLE_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  

export const generateRouter = createTRPCRouter({
    generateIcon: protectedProcedure
    .input(
        z.object({
            prompt: z.string(),
        })
    ).mutation( async ({ctx, input}) =>{

        // TODO: Verify the user has enough credits 
        const {count} = await ctx.prisma.user.updateMany({
            where: {
                id: ctx.session.user.id,  // TODO: replace with a real id
                credits: {
                    gte: 1,
                },  
            },
            data:{
                credits: {
                    decrement: 1,
                }
            }
        });

        if (count <= 0){
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You do not have enough credits'
            })
        }

        //TODO: make a fetch request to DALLE API
        const response = await openai.createImage({
            prompt: input.prompt,
            n: 1,
            size: "1024x1024",
          });

          console.log("RESPONSE", response)

          const url = response.data.data[0]?.url

          console.log("URL", url)

        return {
            imageUrl: url,
        };
    }), 
});
