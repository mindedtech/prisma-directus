const main = async (): Promise<void> => {
  await Promise.resolve();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
