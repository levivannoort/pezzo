import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetEnvironmentBySlugInput {
  @Field(() => String, { nullable: false })
  slug: string;

  @Field(() => String, { nullable: false })
  projectId: string;
}
