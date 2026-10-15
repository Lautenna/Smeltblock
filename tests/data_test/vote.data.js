
const UUID_YVANOR = '22b9a9ba74d84ee6acff70fd2b9cf924';
const UUID_LAUTENNA = '888ab262375f45098fdabbd001febffa';
const UUID_WARND = 'eb69cef08d6b49bb9575e751185834b2';
const UUID_LESUPAPONEY = '986db577680b402bb55f50471c050fb2';
const UUID_CANASUCRE = 'f8cbe114476c43ad90af1a64986200dc';

// Une seconde d'écart entre chaque vote : la contrainte uniq_vote_dedup refuse deux votes du même joueur à la même seconde
let decalage = 0;
function randomRegisteredAt() {
    const now = (new Date()).getTime()
    return new Date(now + (decalage++) * 1000)
}

export function jddVote() {
    let votes = []
    for (let v = 0; v <= 2; v++) {
        votes.push({ player_uuid: UUID_YVANOR, ip: '10.0.0.1', website_id: 1, reward_given: 1, registered_at: randomRegisteredAt() },
        )
    }

    for (let v = 0; v <= 8; v++) {
        votes.push({
            player_uuid: UUID_LAUTENNA, ip: '10.0.0.2', website_id: 1, reward_given: 1, registered_at: randomRegisteredAt()
        },
        )
    }

    for (let v = 0; v <= 28; v++) {
        votes.push({ player_uuid: UUID_WARND, ip: '10.0.0.3', website_id: 1, reward_given: 1, registered_at: randomRegisteredAt() },
        )
    }

    for (let v = 0; v <= 1; v++) {
        votes.push({ player_uuid: UUID_LESUPAPONEY, ip: '10.0.0.4', website_id: 1, reward_given: 1, registered_at: randomRegisteredAt() },
        )
    }

    for (let v = 0; v <= 15; v++) {
        votes.push({ player_uuid: UUID_CANASUCRE, ip: '10.0.0.5', website_id: 1, reward_given: 1, registered_at: randomRegisteredAt() })
    }
    return votes

}

export const TEST_UUIDS = [UUID_YVANOR, UUID_LAUTENNA, UUID_WARND, UUID_LESUPAPONEY, UUID_CANASUCRE];
