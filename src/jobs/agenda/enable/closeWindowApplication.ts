import AdmissionService from "@/services/admission.service";
import { logger } from "@/utils/logger"
import { Agenda } from "@hokify/agenda";

const closeWindowApplication = (agenda: Agenda) => {
    const admissionService = new AdmissionService();
    logger.info("Install job CLOSE-WINDOW-APPLICATION success!!");

    agenda.define("CLOSE-WINDOW-APPLICATION", async (job, done) => {
        try {
            await admissionService.checkWindowApplicationCloseTime();
            done();
        } catch (error) {
            done(error.message);
        }
    }, { concurrency: 1, lockLimit: 1 });

    agenda.every("*/1 * * * *", "CLOSE-WINDOW-APPLICATION");
};

export default closeWindowApplication;