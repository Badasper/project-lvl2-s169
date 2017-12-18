#!/usr/bin/env nodejs

import program from 'commander';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format', 'json')
  .action((file1, file2) => {
    console.log(`Заглушка: ${file1}, ${file2}`);
  })
  .parse(process.argv);
