// === start of custom type ===
  // Watchlists.WatchlistsTags.tags
  export type WatchlistsTags = Array<{
 
  }>;
  // === end of custom type ===
// === start of custom type ===
  // WatchlistItems.WatchlistItemsMetadata.metadata
  export type WatchlistItemsMetadata = Array<{
 
  }>;
  // === end of custom type ===

/**
 * This file was @generated using typed-pocketbase
 */

// https://pocketbase.io/docs/collections/#base-collection
export interface BaseCollectionResponse {
	/**
	 * 15 characters string to store as record ID.
	 */
	id: string;
	/**
	 * Date string representation for the creation date.
	 */
	created: string;
	/**
	 * Date string representation for the creation date.
	 */
	updated: string;
	/**
	 * The collection id.
	 */
	collectionId: string;
	/**
	 * The collection name.
	 */
	collectionName: string;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface BaseCollectionCreate {
	/**
	 * 15 characters string to store as record ID.
	 * If not set, it will be auto generated.
	 */
	id?: string;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface BaseCollectionUpdate {}

// https://pocketbase.io/docs/collections/#auth-collection
export interface AuthCollectionResponse extends BaseCollectionResponse {
	/**
	 * The username of the auth record.
	 */
	username: string;
	/**
	 * Auth record email address.
	 */
	email: string;
	/**
	 * Auth record email address.
	 */
	tokenKey?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility: boolean;
	/**
	 * Indicates whether the auth record is verified or not.
	 */
	verified: boolean;
}

// https://pocketbase.io/docs/api-records/#create-record
export interface AuthCollectionCreate extends BaseCollectionCreate {
	/**
	 * The username of the auth record.
	 * If not set, it will be auto generated.
	 */
	username?: string;
	/**
	 * Auth record email address.
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Auth record password.
	 */
	password: string;
	/**
	 * Auth record password confirmation.
	 */
	passwordConfirm: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/api-records/#update-record
export interface AuthCollectionUpdate {
	/**
	 * The username of the auth record.
	 */
	username?: string;
	/**
	 * The auth record email address.
	 * This field can be updated only by admins or auth records with "Manage" access.
	 * Regular accounts can update their email by calling "Request email change".
	 */
	email?: string;
	/**
	 * Whether to show/hide the auth record email when fetching the record data.
	 */
	emailVisibility?: boolean;
	/**
	 * Old auth record password.
	 * This field is required only when changing the record password. Admins and auth records with "Manage" access can skip this field.
	 */
	oldPassword?: string;
	/**
	 * New auth record password.
	 */
	password?: string;
	/**
	 * New auth record password confirmation.
	 */
	passwordConfirm?: string;
	/**
	 * Indicates whether the auth record is verified or not.
	 * This field can be set only by admins or auth records with "Manage" access.
	 */
	verified?: boolean;
}

// https://pocketbase.io/docs/collections/#view-collection
export interface ViewCollectionRecord {
	id: string;
}

// utilities

type MaybeArray<T> = T | T[];

// ===== _mfas block =====
// ===== _mfas =====

export interface MfasResponse extends BaseCollectionResponse {
	collectionName: '_mfas';
	id: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created: string;
	updated: string;
}

export interface MfasCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	method: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface MfasCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_mfas';
	response: MfasResponse;
	create: MfasCreate;
	update: MfasUpdate;
	relations: Record<string, never>;
}

// ===== _otps block =====
// ===== _otps =====

export interface OtpsResponse extends BaseCollectionResponse {
	collectionName: '_otps';
	id: string;
	collectionRef: string;
	recordRef: string;
	created: string;
	updated: string;
}

export interface OtpsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface OtpsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_otps';
	response: OtpsResponse;
	create: OtpsCreate;
	update: OtpsUpdate;
	relations: Record<string, never>;
}

// ===== _externalAuths block =====
// ===== _externalAuths =====

export interface ExternalAuthsResponse extends BaseCollectionResponse {
	collectionName: '_externalAuths';
	id: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created: string;
	updated: string;
}

export interface ExternalAuthsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	provider: string;
	providerId: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface ExternalAuthsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_externalAuths';
	response: ExternalAuthsResponse;
	create: ExternalAuthsCreate;
	update: ExternalAuthsUpdate;
	relations: Record<string, never>;
}

// ===== _authOrigins block =====
// ===== _authOrigins =====

export interface AuthOriginsResponse extends BaseCollectionResponse {
	collectionName: '_authOrigins';
	id: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created: string;
	updated: string;
}

export interface AuthOriginsCreate extends BaseCollectionCreate {
	id?: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsUpdate extends BaseCollectionUpdate {
	id: string;
	collectionRef: string;
	recordRef: string;
	fingerprint: string;
	created?: string | Date;
	updated?: string | Date;
}

export interface AuthOriginsCollection {
	type: 'base';
	collectionId: string;
	collectionName: '_authOrigins';
	response: AuthOriginsResponse;
	create: AuthOriginsCreate;
	update: AuthOriginsUpdate;
	relations: Record<string, never>;
}

// ===== _superusers block =====
// ===== _superusers =====

export interface SuperusersResponse extends AuthCollectionResponse {
	collectionName: '_superusers';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	created: string;
	updated: string;
}

export interface SuperusersCreate extends AuthCollectionCreate {
	id?: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersUpdate extends AuthCollectionUpdate {
	id: string;
	email: string;
	emailVisibility?: boolean;
	verified?: boolean;
	created?: string | Date;
	updated?: string | Date;
}

export interface SuperusersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: '_superusers';
	response: SuperusersResponse;
	create: SuperusersCreate;
	update: SuperusersUpdate;
	relations: Record<string, never>;
}

// ===== users block =====
// ===== users =====

export interface UsersResponse extends AuthCollectionResponse {
	collectionName: 'users';
	id: string;
	tokenKey: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
	name: string;
	avatar: string;
	avatarUrl: string;
	created: string;
	updated: string;
}

export interface UsersCreate extends AuthCollectionCreate {
	id?: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	avatarUrl?: string | URL;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersUpdate extends AuthCollectionUpdate {
	id: string;
	email?: string;
	emailVisibility?: boolean;
	verified?: boolean;
	name?: string;
	avatar?: File | null;
	avatarUrl?: string | URL;
	created?: string | Date;
	updated?: string | Date;
}

export interface UsersCollection {
	type: 'auth';
	collectionId: string;
	collectionName: 'users';
	response: UsersResponse;
	create: UsersCreate;
	update: UsersUpdate;
	relations: {
		watchlists_via_owner: WatchlistsCollection[];
		userFollows_via_follower: UserFollowsCollection[];
		userFollows_via_following: UserFollowsCollection[];
		watchlistLikes_via_user: WatchlistLikesCollection[];
		watchlistShares_via_user: WatchlistSharesCollection[];
		watchlistComments_via_author: WatchlistCommentsCollection[];
	};
}

// ===== watchlists block =====
// ===== watchlists =====

export interface WatchlistsResponse extends BaseCollectionResponse {
	collectionName: 'watchlists';
	id: string;
	title: string;
	description: string;
	owner: Array<string>;
	isPublic: boolean;
	category: Array<'movies' | 'tv_shows' | 'mixed' | 'documentaries' | 'anime' | 'comedy' | 'drama' | 'action' | 'horror' | 'sci_fi' | 'romance' | 'thriller' | 'other'>;
	coverImage: MaybeArray<string>;
	tags?: WatchlistsTags
}

export interface WatchlistsCreate extends BaseCollectionCreate {
	id?: string;
	title: string;
	description?: string;
	owner: MaybeArray<string>;
	isPublic?: boolean;
	category?: MaybeArray<'movies' | 'tv_shows' | 'mixed' | 'documentaries' | 'anime' | 'comedy' | 'drama' | 'action' | 'horror' | 'sci_fi' | 'romance' | 'thriller' | 'other'>;
	coverImage?: MaybeArray<File>;
	tags?: WatchlistsTags
}

export interface WatchlistsUpdate extends BaseCollectionUpdate {
	id: string;
	title: string;
	description?: string;
	owner: MaybeArray<string>;
	'owner+'?: MaybeArray<string>;
	'owner-'?: MaybeArray<string>;
	isPublic?: boolean;
	category?: MaybeArray<'movies' | 'tv_shows' | 'mixed' | 'documentaries' | 'anime' | 'comedy' | 'drama' | 'action' | 'horror' | 'sci_fi' | 'romance' | 'thriller' | 'other'>;
	'category+'?: MaybeArray<'movies' | 'tv_shows' | 'mixed' | 'documentaries' | 'anime' | 'comedy' | 'drama' | 'action' | 'horror' | 'sci_fi' | 'romance' | 'thriller' | 'other'>;
	'category-'?: MaybeArray<'movies' | 'tv_shows' | 'mixed' | 'documentaries' | 'anime' | 'comedy' | 'drama' | 'action' | 'horror' | 'sci_fi' | 'romance' | 'thriller' | 'other'>;
	coverImage?: MaybeArray<File>;
	'coverImage-'?: string;
	tags?: WatchlistsTags
}

export interface WatchlistsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlists';
	response: WatchlistsResponse;
	create: WatchlistsCreate;
	update: WatchlistsUpdate;
	relations: {
		owner: UsersCollection[];
		watchlistLikes_via_watchlist: WatchlistLikesCollection[];
		watchlistShares_via_watchlist: WatchlistSharesCollection[];
		watchlistItems_via_watchlist: WatchlistItemsCollection[];
		watchlistComments_via_watchlist: WatchlistCommentsCollection[];
	};
}

// ===== userFollows block =====
// ===== userFollows =====

export interface UserFollowsResponse extends BaseCollectionResponse {
	collectionName: 'userFollows';
	id: string;
	follower: Array<string>;
	following: Array<string>;
	created: string;
	updated: string;
}

export interface UserFollowsCreate extends BaseCollectionCreate {
	id?: string;
	follower: MaybeArray<string>;
	following: MaybeArray<string>;
	created?: string | Date;
	updated?: string | Date;
}

export interface UserFollowsUpdate extends BaseCollectionUpdate {
	id: string;
	follower: MaybeArray<string>;
	'follower+'?: MaybeArray<string>;
	'follower-'?: MaybeArray<string>;
	following: MaybeArray<string>;
	'following+'?: MaybeArray<string>;
	'following-'?: MaybeArray<string>;
	created?: string | Date;
	updated?: string | Date;
}

export interface UserFollowsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'userFollows';
	response: UserFollowsResponse;
	create: UserFollowsCreate;
	update: UserFollowsUpdate;
	relations: {
		follower: UsersCollection[];
		following: UsersCollection[];
	};
}

// ===== watchlistLikes block =====
// ===== watchlistLikes =====

export interface WatchlistLikesResponse extends BaseCollectionResponse {
	collectionName: 'watchlistLikes';
	id: string;
	user: Array<string>;
	watchlist: Array<string>;
	created: string;
	updated: string;
}

export interface WatchlistLikesCreate extends BaseCollectionCreate {
	id?: string;
	user: MaybeArray<string>;
	watchlist: MaybeArray<string>;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistLikesUpdate extends BaseCollectionUpdate {
	id: string;
	user: MaybeArray<string>;
	'user+'?: MaybeArray<string>;
	'user-'?: MaybeArray<string>;
	watchlist: MaybeArray<string>;
	'watchlist+'?: MaybeArray<string>;
	'watchlist-'?: MaybeArray<string>;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistLikesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlistLikes';
	response: WatchlistLikesResponse;
	create: WatchlistLikesCreate;
	update: WatchlistLikesUpdate;
	relations: {
		user: UsersCollection[];
		watchlist: WatchlistsCollection[];
	};
}

// ===== watchlistShares block =====
// ===== watchlistShares =====

export interface WatchlistSharesResponse extends BaseCollectionResponse {
	collectionName: 'watchlistShares';
	id: string;
	watchlist: Array<string>;
	user: Array<string>;
	permission: Array<'view' | 'edit'>;
	created: string;
	updated: string;
}

export interface WatchlistSharesCreate extends BaseCollectionCreate {
	id?: string;
	watchlist: MaybeArray<string>;
	user: MaybeArray<string>;
	permission: MaybeArray<'view' | 'edit'>;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistSharesUpdate extends BaseCollectionUpdate {
	id: string;
	watchlist: MaybeArray<string>;
	'watchlist+'?: MaybeArray<string>;
	'watchlist-'?: MaybeArray<string>;
	user: MaybeArray<string>;
	'user+'?: MaybeArray<string>;
	'user-'?: MaybeArray<string>;
	permission: MaybeArray<'view' | 'edit'>;
	'permission+'?: MaybeArray<'view' | 'edit'>;
	'permission-'?: MaybeArray<'view' | 'edit'>;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistSharesCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlistShares';
	response: WatchlistSharesResponse;
	create: WatchlistSharesCreate;
	update: WatchlistSharesUpdate;
	relations: {
		watchlist: WatchlistsCollection[];
		user: UsersCollection[];
	};
}

// ===== watchlistItems block =====
// ===== watchlistItems =====

export interface WatchlistItemsResponse extends BaseCollectionResponse {
	collectionName: 'watchlistItems';
	id: string;
	watchlist: Array<string>;
	mediaType: Array<'movie' | 'tv_show'>;
	traktId: number;
	tmdbId: number;
	imdbId: string;
	title: string;
	year: number;
	slug: string;
	metadata?: WatchlistItemsMetadata
	personalNote: string;
	status: Array<'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold'>;
	rating: number;
	order: number;
	created: string;
	updated: string;
}

export interface WatchlistItemsCreate extends BaseCollectionCreate {
	id?: string;
	watchlist: MaybeArray<string>;
	mediaType: MaybeArray<'movie' | 'tv_show'>;
	traktId: number;
	tmdbId?: number;
	imdbId?: string;
	title: string;
	year?: number;
	slug?: string;
	metadata?: WatchlistItemsMetadata
	personalNote?: string;
	status?: MaybeArray<'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold'>;
	rating?: number;
	order?: number;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistItemsUpdate extends BaseCollectionUpdate {
	id: string;
	watchlist: MaybeArray<string>;
	'watchlist+'?: MaybeArray<string>;
	'watchlist-'?: MaybeArray<string>;
	mediaType: MaybeArray<'movie' | 'tv_show'>;
	'mediaType+'?: MaybeArray<'movie' | 'tv_show'>;
	'mediaType-'?: MaybeArray<'movie' | 'tv_show'>;
	traktId: number;
	'traktId+'?: number;
	'traktId-'?: number;
	tmdbId?: number;
	'tmdbId+'?: number;
	'tmdbId-'?: number;
	imdbId?: string;
	title: string;
	year?: number;
	'year+'?: number;
	'year-'?: number;
	slug?: string;
	metadata?: WatchlistItemsMetadata
	personalNote?: string;
	status?: MaybeArray<'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold'>;
	'status+'?: MaybeArray<'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold'>;
	'status-'?: MaybeArray<'plan_to_watch' | 'watching' | 'completed' | 'dropped' | 'on_hold'>;
	rating?: number;
	'rating+'?: number;
	'rating-'?: number;
	order?: number;
	'order+'?: number;
	'order-'?: number;
	created?: string | Date;
	updated?: string | Date;
}

export interface WatchlistItemsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlistItems';
	response: WatchlistItemsResponse;
	create: WatchlistItemsCreate;
	update: WatchlistItemsUpdate;
	relations: {
		watchlist: WatchlistsCollection[];
	};
}

// ===== watchlistComments block =====
// ===== watchlistComments =====

export interface WatchlistCommentsResponse extends BaseCollectionResponse {
	collectionName: 'watchlistComments';
	id: string;
	watchlist: Array<string>;
	author: Array<string>;
	content: string;
	parentComment: Array<string>;
}

export interface WatchlistCommentsCreate extends BaseCollectionCreate {
	id?: string;
	watchlist: MaybeArray<string>;
	author: MaybeArray<string>;
	content: string;
	parentComment?: MaybeArray<string>;
}

export interface WatchlistCommentsUpdate extends BaseCollectionUpdate {
	id: string;
	watchlist: MaybeArray<string>;
	'watchlist+'?: MaybeArray<string>;
	'watchlist-'?: MaybeArray<string>;
	author: MaybeArray<string>;
	'author+'?: MaybeArray<string>;
	'author-'?: MaybeArray<string>;
	content: string;
	parentComment?: MaybeArray<string>;
	'parentComment+'?: MaybeArray<string>;
	'parentComment-'?: MaybeArray<string>;
}

export interface WatchlistCommentsCollection {
	type: 'base';
	collectionId: string;
	collectionName: 'watchlistComments';
	response: WatchlistCommentsResponse;
	create: WatchlistCommentsCreate;
	update: WatchlistCommentsUpdate;
	relations: {
		watchlist: WatchlistsCollection[];
		author: UsersCollection[];
		parentComment: WatchlistCommentsCollection[];
		watchlistComments_via_parentComment: WatchlistCommentsCollection[];
	};
}

// ===== Schema =====

export type Schema = {
	_mfas: MfasCollection;
	_otps: OtpsCollection;
	_externalAuths: ExternalAuthsCollection;
	_authOrigins: AuthOriginsCollection;
	_superusers: SuperusersCollection;
	users: UsersCollection;
	watchlists: WatchlistsCollection;
	userFollows: UserFollowsCollection;
	watchlistLikes: WatchlistLikesCollection;
	watchlistShares: WatchlistSharesCollection;
	watchlistItems: WatchlistItemsCollection;
	watchlistComments: WatchlistCommentsCollection;
}