import { PrismaClient } from "../../src/generated/prisma";

export default class PrismaService {
    private static prisma: PrismaClient;

    constructor() {
        if (!PrismaService.prisma) {
            PrismaService.prisma = new PrismaClient();
        }
    }
    getClient() {
        return PrismaService.prisma;
    }
}
