# Prisma Upgrade

Prisma Upgrade is a CLI tool to help Prisma 1 users upgrade to Prisma 2.0.

## Scope

We spent a lot of time on this tool and are happy with the results. It's well-tested and working as intended. It's not perfect though, so you may need to make some manual adjustments after upgrading to clean up your final Prisma 2 schema. See [this issue](https://github.com/prisma/upgrade/issues/67) for more details.

We recommend you download the [Prisma 2 VSCode extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) to help with your transition. 

You should always run the SQL generated by this tool on your test or staging databases before running it on production.

## Usage

```sh
$ npx prisma-upgrade
```

See [our documentation](https://www.prisma.io/docs/guides/upgrade-from-prisma-1/how-to-upgrade#prisma-upgrade-cli) for more information about how to upgrade your Prisma 1 datamodel to Prisma 2.

## Current features

This table reflects the _current_ feature set of the upgrade CLI and will be updated continuously. Read below for a more detailled explanation of each column. You can also find more info about each of these feautures in the [docs](https://www.prisma.io/docs/guides/upgrade-from-prisma-1/schema-incompatibilities).

| Name                                  | MySQL   | PostgreSQL | Prisma schema | Prisma 1 compatible |
| ------------------------------------- | ------- | ---------- | ------------- | ------------------- |
| Default values                        | Yes     | Yes        | Yes           | Yes                 |
| Missing UNIQUE for inline 1-1         | Yes     | Yes        | Yes           | Yes                 |
| JSON                                  | Yes     | Yes        | Yes           | Yes                 |
| Enums                                 | Yes     | Yes        | Yes           | Yes                 |
| @createdAt                            | Yes     | Yes        | Yes           | Yes                 |
| Generated IDs with `@default(cuid())` | n/a     | n/a        | Yes           | Yes                 |
| @updatedAt                            | n/a     | n/a        | Yes           | Yes                 |
| `@map` and `@@map`                    | n/a     | n/a        | Yes           | Yes                 |
| Maintain required 1-1-relations       | n/a     | n/a        | Yes           | Yes                 |
| Maintain order of models and fields   | n/a     | n/a        | Not yet       | Yes                 |
| Maintain relation names               | n/a     | n/a        | Not yet       | Yes                 |
| Relation tables are all m-n           | Not yet | Not yet    | Not yet       | No                  |
| Scalar lists have extra table         | Not yet | Not yet    | Not yet       | No                  |
| Cascading deletes                     | No      | No         | No            | No                  |


What do the columns mean?

- **MySQL**: Does the CLI generate the correct MySQL statements to solve the problem?
- **PostgreSQL**: Does the CLI generate correct PostgreSQL statements to solve the problem?
- **Prisma schema**: Does the final Prisma schema I get from the CLI reflect the right solution?
- **Prisma 1 compatible:** Does the SQL change to the schema maintain Prisma 1 compatibility?

## How Prisma Upgrade (Technically) Works

We parse your Prisma 1 datamodel and your Prisma 2.0 schema and run both ASTs through a set of rules. These rules produce operations. The operations are printed into SQL commands for you to run on your database.

Prisma upgrade is idempotent, so you can run it as many times as you want and it will produce the same result each time. Prisma upgrade only shows you commands you still need to run, it does not show you commands you've already run.

You'll also notice that we never connect to your database, we simply look at your Prisma 1 files and your Prisma 2.0 schema and generate from there!

## Tests

Testing consists of 2 parts: a Local SQL Dump and Running Tests

### Local SQL Dump

_Requirements:_ MySQL@5, Docker

Since it's cumbersome to run Prisma 1 in CI, we need to locally setup test cases first

### Setting up MySQL for examples

```
mysqladmin -h localhost -u root create prisma
mysql -h localhost -u root prisma < ./examples/mysql-ablog/dump.sql
mysqladmin -h localhost -u root drop prisma -f
```

## Security

If you have a security issue to report, please contact us at [security@prisma.io](mailto:security@prisma.io?subject=[GitHub]%20Prisma%202%20Security%20Report%20Upgrade)
