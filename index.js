import { readInputFile, writeSubmissionFile } from './hashcodeUtils'


function createRole([skill, skillLevel]) {
    return {
        skillLevel,
        assignee: '',
        skill,
        assigneeLevel: 0
    }
}

function findMentor(contributor, contributors,  role, projectRoles) {
    return contributors.find((cont) => {
        cont.skills[role.skill] >= role.skillLevel && projectRoles
                .filter(projectRole => projectRole.skill !== role.skill)
                .some(projectRole =>  
                    projectRole.skillLevel <= cont.skills[projectRole.skill].skillLevel
                )
    })
}

function scoreProject({ nDays, score, roles, dayBefore }, today) {
    const b = (dayBefore + score) - today
    const c = roles.length * (roles.reduce((acc, role) => acc + role.skillLevel, 0) / roles.length)
    const val = Math.min(score, Math.max(0, score - today + nDays - dayBefore))
    return (b * val / c * nDays)
}

function main() {
    const contributors = {}
    const projects = {}

    const lines = readInputFile('./problem/inputFiles/a_an_example.in.txt')
    const nContributors = lines[0][0]
    const nProject = lines[0][1]
    let i = 1
    while (Object.keys(contributors).length < nContributors) {
        const skills = {}
        const nSkills = lines[i][1]
        for (let j = i + 1; j <= i + nSkills; j++) {
            skills[lines[j][0]] = lines[j][1]
        }
        contributors[lines[i][0]] = {
            skills,
            freeFrom: 0
        }

        i += nSkills + 1
    }
    while (Object.keys(projects).length < nProject) {
        const projectName = lines[i][0]
        projects[projectName] = {
            nDays: lines[i][1],
            score: lines[i][2],
            dayBefore: lines[i][3],
            maxStartingDate: lines[i][3] + lines[i][2] - lines[i][1],
            roles: []
        }
        const nRoles = lines[i][4]
        for (let j = i + 1; j <= i + nRoles; j++) {
            projects[projectName].roles.push(createRole(lines[j]))
        }
        i += nRoles + 1

    }
    let projectAssignable = true
    let today = 0
    while (projectAssignable) {
        const orderedProjects = Object.entries(projects).sort(([a, avalue], [b, bvalue]) => (scoreProject(bvalue, today) - scoreProject(avalue, today)))
        
        const projectToStart = orderedProjects[1]
        projectToStart[1].roles.forEach(role => {
            const matchingContributors = Object.entries(contributors)
                .filter(([name, contributor]) => {
                    return contributor.skills[role.skill] >= role.skillLevel - 1
                })
                .sort(([aname, avalue], [bname, bvalue]) => avalue.skills[role] - bvalue.skills[role])
            console.log(matchingContributors[0])
            
            matchingContributors.forEach(([contributorName, contributor]) => {
                if(contributor.skills[role.skill] === role.skillLevel - 1 ) {
                    const mentor = findMentor(contributor, Object.entries(contributors),  role, projectToStart[1].roles)
                    console.log(mentor)
                }
        })

    })
    break
}

writeSubmissionFile('./output.txt', 'Scrivi qui il tuo submission')
}

main()
