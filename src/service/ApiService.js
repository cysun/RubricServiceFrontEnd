import axios from 'axios';

// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/comments';
const API_BASE_URL = 'http://localhost:8080/rubric';
class ApiService {

    // fetchTest(){
    //     return axios.get(API_BASE_URL);
    // }
    fetchRubrics() {
        return axios.get(API_BASE_URL);
    }

    fetchRubricById(rubricId) {
        return axios.get(API_BASE_URL + '/' + rubricId);
    }

    searchRubric(text) {
        return axios.get(API_BASE_URL + '/search/{text}?text=' + text);
    }

    deleteRubric(rubricId) {
        return axios.delete(API_BASE_URL + '/delete/' + rubricId);
    }

    addRubric(rubric) {
        return axios.post("" + API_BASE_URL, rubric);
    }
    addExistedCriterionUnderRubric(rubricId, criterionId) {
        return axios.post(API_BASE_URL + "/" + rubricId + "/criterion/" + criterionId);
    }
    removeCriterionUnderRubric(rubricId,criterionId){
        return axios.delete(API_BASE_URL + "/" + rubricId + "/criterion/" + criterionId);
    }
    async asyncAddCriterion(criterion, publishDate) {
        const newCriterion = {
            name: criterion.name,
            description: criterion.description,
            publishDate: publishDate,
            reusable: false,
            ratings: criterion.ratings.map(function (rating) { return { description: rating.description, value: rating.value } })
        };
        var response = await axios.post(API_BASE_URL + '/criterion', newCriterion);
        var data = response.data;
        // criterion.ratings.map(
        //     rating => {
        //         const newRating = { description: rating.description, value: rating.value };
        //         return this.addRating(newRating, response.data);
        //     })
        return new Promise(function (resolve, reject) {
            resolve(data);
        });
    }
    addCriterionUnderRubric(rubricId, criterion, publishDate) {
        const newCriterion = {
            name: criterion.name,
            description: criterion.description,
            publishDate: publishDate,
            reusable: false
        };
        return axios.post(API_BASE_URL + '/criterion', newCriterion).then(response => {
            //bind relationship between criterion and rubric
            this.addExistedCriterionUnderRubric(rubricId, response.data);

            //bind relationship between ratings and criterion
            criterion.ratings.map(
                rating => {
                    const newRating = { description: rating.description, value: rating.value };
                    return this.addRating(newRating, response.data);
                })

        })
    }
    editRubric(rubric, criteria, importedCriteria) {
        //first update rubric basic props, then clear all original criteria with original rubric
        return axios.patch(API_BASE_URL + '/' + rubric.id, rubric).then(response => {
            //then we are going to create connection with rubric and importedCriteria
            importedCriteria.map(
                c => {
                    return this.addExistedCriterionUnderRubric(rubric.id, c.id);
                }
            )
            //first add all criterion
            var promises = criteria.map(
                criterion => {
                    return this.asyncAddCriterion(criterion, rubric.publishDate);
                }
            );
            //then bind all criterion with rubric (results: array of cid)
            Promise.all(promises).then(function (results) {
                return axios.post(API_BASE_URL + "/" + rubric.id + "/criteria/", results);
            });
        })
    }

    fetchCriteria() {
        return axios.get(API_BASE_URL + '/criterion');
    }

    fetchCriterionById(criterionId) {
        return axios.get(API_BASE_URL + '/criterion/' + criterionId);
    }

    searchCriterion(text) {
        return axios.get(API_BASE_URL + '/criterion/search/{text}?text=' + text);
    }
    deleteCriterion(criterionId) {
        return axios.delete(API_BASE_URL + '/criterion/delete/' + criterionId);
    }

    addCriterion(criterion, ratings, tags) {
        const newCriterion = {
            name: criterion.name,
            description: criterion.description,
            publishDate: criterion.publishDate,
            reusable: criterion.reusable,
            ratings: ratings.map(function (rating) { return { description: rating.description, value: rating.value } }),
            tags: tags.map(function(t){return {value:t}})
        };
        return axios.post("" + API_BASE_URL + '/criterion', newCriterion);
    }

    editCriterion(criterion, ratings, tags) {
        const newCriterion = {
            id: criterion.id,
            name: criterion.name,
            description: criterion.description,
            publishDate: criterion.publishDate,
            reusable: criterion.reusable,
            ratings: ratings.map(function (rating) { return { description: rating.description, value: rating.value } }),
            tags: tags.map(function(t){return {value:t}})
        };
        return axios.patch(API_BASE_URL + '/criterion/' + criterion.id, newCriterion);
    }
    addRating(rating, criterionId) {
        return axios.post(API_BASE_URL + '/criterion/' + criterionId + '/rating', rating);
    }

    addTag(tag, criterionId) {
        return axios.post(API_BASE_URL + '/criterion/' + criterionId + '/tag', tag);
    }

    fetchTags() {
        return axios.get(API_BASE_URL + '/tag');
    }

    fetchhTagById(tagId) {
        return axios.get(API_BASE_URL + '/tag/' + tagId);
    }

    fetchCriteriaByTag(tagname) {
        return axios.get(API_BASE_URL + '/criterion/tag/' + tagname);
    }

    searchTag(text) {
        return axios.get(API_BASE_URL + '/tag/search/{text}?text=' + text);
    }
}

export default new ApiService();