import { dbConnection } from "@/databases";
import { findTsFilesInDirectory } from "@/helper/fileSystem";
import { logger } from "@/utils/logger";
import { Agenda } from "@hokify/agenda";

const agenda: Agenda = new Agenda({ name: "agenda", db: { collection: "agenda_jobs", address: dbConnection.url } });

const isEnableAgenda = (process.env.CRONJOB === "1");

const initializeJob = () => {
    findTsFilesInDirectory(__dirname + "/enable").map((job_path) => {
        try {
            require(job_path).default(agenda);
        } catch (error) {
            logger.error(error);
        }
    });
}

agenda.on("ready", async () => {
    initializeJob();
    logger.info(isEnableAgenda ? "Agenda Enable!!" : "Agenda Disable!!");
    if (isEnableAgenda) {
        const job_clear = [];
        await agenda.cancel({ name: { $in: job_clear } });
        logger.info("Clear job success!!");
    }
    logger.info("Agenda create instant success!!");
});

agenda.on("fail", job => {
    logger.error(job);
});

const graceful = async () => {
    await agenda.stop();
    logger.info("Agenda stop!!");
    process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

export default agenda;