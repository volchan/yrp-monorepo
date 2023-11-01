import express from 'express'

import flareSolversController from '@controllers/flareSolversController'

const FlareSolverRouter = express.Router()

FlareSolverRouter.get('/', flareSolversController.index)

export default FlareSolverRouter

// const { data }: { data: XmlData } = await axiosInstance.post('/v1', {
//   cmd: 'request.get',
//   url: `https://www3.yggtorrent.wtf/rss?action=generate&type=cat&id=2145&passkey=${appEnv.YGG_PASSKEY}}`,
//   maxTimeout: 60000,
// })

// const regex = /(<channel>[\s\S]*<\/channel>)/g
// const match = data.solution.response.match(regex)

// const parser = new XMLParser()
// const feed: RssFeed = parser.parse(match?.[0] || 'null')

// const items: TorrentItem[] = feed.channel.item

// items.forEach(item => (item.parsedTileInfos = pttParse(item.title)))

// res.send({ items })

// const axiosInstance = axios.create({
//   baseURL: appEnv.FLARE_SOLVER_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// type XmlData = {
//   status: string
//   message: string
//   solution: {
//     url: string
//     status: number
//     cookies: Array<{
//       domain: string
//       expiry: number
//       httpOnly: boolean
//       name: string
//       path: string
//       sameSite: string
//       secure: boolean
//       value: string
//     }>
//     userAgent: string
//     headers: object
//     response: string
//   }
//   startTimestamp: number
//   endTimestamp: number
//   version: string
// }

// type TorrentItem = {
//   title: string
//   link: string
//   category: string
//   description: string
//   guid: string
//   pubDate: string
//   enclosure: string
//   parsedTileInfos?: DefaultParserResult
// }

// type RssFeed = {
//   channel: {
//     'atom:link': string
//     title: string
//     link: string
//     image: {
//       url: string
//       title: string
//       link: string
//       description: string
//     }
//     description: string
//     language: string
//     generator: string
//     copyright: string
//     item: TorrentItem[]
//   }
// }
