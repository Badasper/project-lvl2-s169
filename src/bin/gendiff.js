#!/usr/bin/env nodejs

import program from 'commander';
import gendiff from '..';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format', 'json')
  .action((file1, file2) => {
    console.log(gendiff(file1, file2));
  })
  .parse(process.argv);
