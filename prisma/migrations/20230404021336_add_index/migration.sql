-- DropIndex
DROP INDEX `task_userId_key` ON `task`;

-- CreateIndex
CREATE INDEX `task_userId_idx` ON `task`(`userId`);
