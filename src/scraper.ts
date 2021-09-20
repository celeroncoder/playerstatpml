import axios from "axios";
import cheerio from "cheerio";

import PlayerData from "./models/PlayerData";

const axiosInstance = axios.create({
    baseURL: "https://www.premierleague.com/stats/top/players",
});

type scrapeURLType = "goals" | "goal_assist";

async function scrapePlayerData(
    scrapeUrl: scrapeURLType
): Promise<PlayerData[]> {
    const data: PlayerData[] = [];
    await axiosInstance
        .get(scrapeUrl)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html, { ignoreWhitespace: true });
            const statsTable: cheerio.Cheerio = $(".statsTableContainer > tr");

            statsTable.each((i, elm) => {
                const rank: number = parseInt(
                    $(elm).find(".rank > strong").text()
                );

                const name: string = $(elm).find(".playerName > strong").text();

                const club = $(elm)
                    .find(".statNameSecondary")
                    .contents()
                    .last()
                    .text()
                    .trim();

                const nationality: string = $(elm)
                    .find(".playerCountry")
                    .text();

                const goals: number = parseInt($(elm).find(".mainStat").text());

                data.push({
                    rank,
                    name,
                    club,
                    nationality,
                    goals,
                });
            });
        })
        .catch(console.error);

    return data;
}

export default scrapePlayerData;
export { scrapeURLType };
