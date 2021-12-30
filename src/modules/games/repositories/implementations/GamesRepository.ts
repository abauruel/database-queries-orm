import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("games.title ilike :param", { param: `%${param}%` })
      .getMany()
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(id) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("games")
      .leftJoinAndSelect("users_games_games", "users_games_games", 'games.id = users_games_games.gamesId')
      .leftJoinAndSelect("users", "users", "users_games_games.usersId = users.id")
      .select(["users.email as email", "users.first_name as first_name", "users.last_name as last_name"])
      .where("users_games_games.gamesId = :id", { id })
      .execute()

    // Complete usando query builder
  }
}
