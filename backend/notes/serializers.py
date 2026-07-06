from rest_framework import serializers
from .models import Subject, Note


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class NoteSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(
        source="subject.name",
        read_only=True
    )

    class Meta:
        model = Note
        fields = [
            "id",
            "title",
            "subject",
            "subject_name",
            "file",
            "uploaded_at",
        ]