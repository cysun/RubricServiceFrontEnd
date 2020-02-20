import axios from 'axios';

// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/comments';
const API_BASE_URL = 'http://localhost:8080/rubric';
class ApiService {

    fetchRubrics() {
        return axios.get(API_BASE_URL);
    }

    fetchRubricById(rubricId) {
        return axios.get(API_BASE_URL + '/' + rubricId);
    }

    searchRubric(text){
        return axios.get(API_BASE_URL+ '/search/'+text);
    }

    deleteRubric(rubricId) {
        return axios.delete(API_BASE_URL + '/delete/' + rubricId);
    }

    addRubric(rubric) {
        return axios.post(""+API_BASE_URL, rubric);
    }

    editRubric(rubric) {
        return axios.patch(API_BASE_URL + '/' + rubric.id, rubric);
    }

    fetchCriteria() {
        return axios.get(API_BASE_URL + '/criterion');
    }

    fetchCriterionById(criterionId) {
        return axios.get(API_BASE_URL + '/criterion/' + criterionId);
    }

    searchCriterion(text){
        return axios.get(API_BASE_URL+ '/criterion/search/{text}?text='+text);
    }
    deleteCriterion(criterionId) {
        return axios.delete(API_BASE_URL + '/criterion/delete/' + criterionId);
    }

    addCriterion(criterion,ratings,tags) {
        return axios.post(""+API_BASE_URL+'/criterion', criterion).then(response => {
            tags.map(
                tag =>
                {
                    const newTag = {name:tag.name};
                    return this.addTag(newTag,response.data);
                }
            ) 
            ratings.map(
                rating =>
                {
                    const newRating = {description:rating.description,value:rating.value};
                    return this.addRating(newRating,response.data);
                }
            )
          })
          
    }

    editCriterion(criterion,ratings,tags) {
        return axios.patch(API_BASE_URL + '/criterion/' + criterion.id, criterion).then(response => {
            tags.map(
                tag =>
                {
                    const newTag = {name:tag.name};
                    return this.addTag(newTag,criterion.id);
                }
            ) 
            ratings.map(
                rating =>
                {
                    const newRating = {description:rating.description,value:rating.value};
                    return this.addRating(newRating,criterion.id);
                }
            ) 
        });
    }
    addRating(rating,criterionId){
        return axios.post(API_BASE_URL+'/criterion/'+criterionId+'/rating',rating);
    }

    addTag(tag,criterionId){
        return axios.post(API_BASE_URL+'/criterion/'+criterionId+'/tag',tag);
    }
}

export default new ApiService();