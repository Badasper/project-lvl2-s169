#!/usr/bin/env nodejs

import program from 'commander';
import genDiff from '..';

program
  .version('0.1.0')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format', 'complex')
  .action((file1, file2) => {
    console.log(genDiff(file1, file2, program.format));
  })
  .parse(process.argv);
