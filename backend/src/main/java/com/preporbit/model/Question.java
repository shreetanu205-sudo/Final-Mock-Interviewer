package com.preporbit.model;

public class Question {

    private String id;
    private int questionNumber;
    private String text;
    private String category;
    private String type; // conceptual, technical, project, problem-solving, behavioral
    private String targetSkill;
    private String difficulty; // easy, medium, hard
    private String evaluationHints;

    public Question() {
    }

    public Question(String id, int questionNumber, String text, String category, String type, String targetSkill, String difficulty, String evaluationHints) {
        this.id = id;
        this.questionNumber = questionNumber;
        this.text = text;
        this.category = category;
        this.type = type;
        this.targetSkill = targetSkill;
        this.difficulty = difficulty;
        this.evaluationHints = evaluationHints;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(int questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTargetSkill() {
        return targetSkill;
    }

    public void setTargetSkill(String targetSkill) {
        this.targetSkill = targetSkill;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getEvaluationHints() {
        return evaluationHints;
    }

    public void setEvaluationHints(String evaluationHints) {
        this.evaluationHints = evaluationHints;
    }
}
