/**
 * Created by Vi on 04.04.2020.
 */
const electron = require('electron')
const fs = require('fs')
const path = require('path')
const $ = selector => document.querySelector(selector)
const marked = require('marked')

const dir = './temp_story_files/'

const $newStory = $('#new-story')
const $allStories = $('#all-stories')
const $newEpisode = $('#new-episode')
const $allEpisodes = $('#all-episodes')
const $newScene = $('#new-scene')
const $allScenes = $('#all-scenes')

const $storyCreation = $('#story-creation')
const $episodeCreation = $('#episode-creation')
const $sceneCreation = $('#scene-creation')

const $storyName = $('#story-name')
const $createStory = $('#create-story')

const $episodeName = $('#episode-name')
const $chooseStory = $('#choose-story')
const $createEpisode = $('#create-episode')

const $chooseEpisode = $('#choose-episode')
const $imageChoose = $('#image-choose')
const $sceneText = $('#scene-text')
const $textStyle = $('#text-style')
const $imageAnimation = $('#image-animation')
const $choices = $('#choices')
const $addChoice = $('#add-choice')
const $prizeText = $('#prize-text')
const $prevScene = $('#prev-scene')
const $preview = $('#preview')
const $createScene = $('#create-scene')

const ID = 'id'
const STORY = 'story'
const NAME = 'name'
const EPISODES = 'episodes'
const SCENES = 'scenes'
const IS_START = 'isStart'
const IMAGE = 'image'
const TEXT = 'text'
const TEXT_POSITION = 'text-position'
const ANIMATION = 'animation'
const PRIZE = 'prize'
const CHOICES = 'choices'
const NEXT_SCENE = 'nextScene'

$newStory.addEventListener('click', () => {
    $storyCreation.hidden = false
    $episodeCreation.hidden = true
    $sceneCreation.hidden = true
})

$newEpisode.addEventListener('click', () => {
    $storyCreation.hidden = true
    $episodeCreation.hidden = false
    $sceneCreation.hidden = true
})

$newScene.addEventListener('click', () => {
    $storyCreation.hidden = true
    $episodeCreation.hidden = true
    $sceneCreation.hidden = false
})

$createStory.addEventListener('click', () => {
    let storyName = $storyName.innerText
    if (!fs.existsSync(path.resolve(dir + storyName))){
        let fileData = '{"' + STORY + '": {"' + NAME + '": "' + storyName + '"}}'
        fs.mkdirSync(path.resolve(dir + storyName));
        fs.writeFileSync(path.resolve(dir + storyName + '/' + storyName), JSON.stringify(fileData), 'utf8', function () {
            log.info('Data in db were saved.');
        })
    }
})

$createEpisode.addEventListener('click', () => {
    let storyName = $chooseStory.innerText //TODO: check getting value from select
    let episodeName = $episodeName.innerText
    if (fs.existsSync(path.resolve(dir + storyName + '/' + storyName))){
        let fileData = fs.readFileSync(path.resolve(dir + storyName + '/' + storyName), 'utf8', (err, jsonString) => {
                if (err) {
                    log.error("File read failed:", err);
                    return err;
                }
                return jsonString;
        });

        if(fileData[EPISODES] == null) {
            fileData[EPISODES] = '"' + EPISODES + '": [{"'
                + ID + '": 1, "'
                + NAME + '": "' + episodeName + '"}]'
        } else {
            for (let elNum = 0; elNum < fileData[EPISODES].length; elNum++) {
                let id = 0;
                if (fileData[EPISODES][elNum][ID] > id) {
                    id = fileData[EPISODES][elNum][ID]
                }
            }
            fileData[EPISODES][fileData[EPISODES].length] = '{"'
                + ID + '": ' + (id + 1) + ', "'
                + NAME + '": "' + episodeName + '"}'
        }
    }
})


