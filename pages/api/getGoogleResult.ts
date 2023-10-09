import type { NextApiRequest, NextApiResponse } from "next";

const { GOOGLE_IMG_SCRAP, GOOGLE_QUERY } = require("google-img-scrap");

type Request = NextApiRequest & {
  query: {
    search: string;
  };
};

export default async function response(req: Request, res: NextApiResponse) {
  const results = await GOOGLE_IMG_SCRAP({ search: req.query.search, limit:4 });

  const urls = results.result.map((result:any) => result.url);
  return res.status(200).json(urls);
}